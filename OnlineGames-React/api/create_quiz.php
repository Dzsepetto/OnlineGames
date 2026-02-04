<?php
require_once __DIR__ . "/bootstrap.php";
require_once __DIR__ . "/db.php";

session_start();

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Bejelentkezés szükséges!"]);
    exit;
}

$creatorId = $_SESSION['user_id'];
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["error" => "JSON hiba: " . json_last_error_msg()]);
    exit;
}

if (
    !$data ||
    empty($data['title']) ||
    !isset($data['questions']) ||
    !is_array($data['questions'])
) {
    http_response_code(400);
    echo json_encode(["error" => "Hiányzó adatok (title/questions)."]);
    exit;
}

function db_uuid(PDO $pdo): string {
    return (string)$pdo->query("select uuid()")->fetchColumn();
}

try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    $pdo->beginTransaction();

    $quizId = db_uuid($pdo);

    $title = trim((string)$data['title']);
    $description = isset($data['description']) ? (string)$data['description'] : '';

    $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
    if ($baseSlug === '') $baseSlug = 'quiz';
    $slug = $baseSlug . "-" . substr(bin2hex(random_bytes(4)), 0, 6);

    $stmt = $pdo->prepare("
        insert into QUIZ (ID, SLUG, TITLE, DESCRIPTION, IS_PUBLISHED, CREATED_BY)
        values (?, ?, ?, ?, 1, ?)
    ");
    $stmt->execute([$quizId, $slug, $title, $description, $creatorId]);

    $insertQuestion = $pdo->prepare("
        insert into QUESTION (ID, QUIZ_ID, TYPE, QUESTION_TEXT, ORDER_INDEX)
        values (?, ?, ?, ?, ?)
    ");

    $insertAnswer = $pdo->prepare("
        insert into ANSWER_OPTION (ID, QUESTION_ID, LABEL, IS_CORRECT, ORDER_INDEX)
        values (?, ?, ?, ?, ?)
    ");

    $insertLeft = $pdo->prepare("
        insert into MATCHING_LEFT_ITEM (ID, QUESTION_ID, TEXT, ORDER_INDEX)
        values (?, ?, ?, ?)
    ");

    $insertRight = $pdo->prepare("
        insert into MATCHING_RIGHT_ITEM (ID, QUESTION_ID, TEXT, ORDER_INDEX)
        values (?, ?, ?, ?)
    ");

    $insertPair = $pdo->prepare("
        insert into MATCHING_PAIR (ID, QUESTION_ID, LEFT_ID, RIGHT_ID)
        values (?, ?, ?, ?)
    ");

    foreach ($data['questions'] as $index => $q) {
        if (!is_array($q)) continue;

        $type = isset($q['type']) ? (string)$q['type'] : '';
        $qText = isset($q['text']) ? trim((string)$q['text']) : '';

        if ($type === '' || $qText === '') continue;

        $questionId = db_uuid($pdo);
        $insertQuestion->execute([$questionId, $quizId, $type, $qText, (int)$index + 1]);

        if ($type === 'MULTIPLE_CHOICE') {
            $answers = isset($q['answers']) && is_array($q['answers']) ? $q['answers'] : [];

            $aOrder = 0;
            foreach ($answers as $ans) {
                if (!is_array($ans)) continue;

                $label = isset($ans['text']) ? trim((string)$ans['text']) : '';
                if ($label === '') continue;

                $aOrder++;
                $isCorrect = !empty($ans['isCorrect']) ? 1 : 0;
                $answerId = db_uuid($pdo);

                $insertAnswer->execute([$answerId, $questionId, $label, $isCorrect, $aOrder]);
            }
        }

        if ($type === 'MATCHING') {
            $pairs = isset($q['pairs']) && is_array($q['pairs']) ? $q['pairs'] : [];

            $leftIdByText = [];
            $rightIdByText = [];
            $leftOrder = 0;
            $rightOrder = 0;

            foreach ($pairs as $pair) {
                if (!is_array($pair)) continue;

                $leftText = isset($pair['left']) ? trim((string)$pair['left']) : '';
                if ($leftText === '') continue;

                $rights = isset($pair['rights']) && is_array($pair['rights']) ? $pair['rights'] : [];

                $cleanRights = [];
                foreach ($rights as $x) {
                    $t = trim((string)$x);
                    if ($t !== '') $cleanRights[] = $t;
                }
                $rights = array_values($cleanRights);

                if (empty($rights)) continue;

                if (!isset($leftIdByText[$leftText])) {
                    $leftOrder++;
                    $leftId = db_uuid($pdo);
                    $leftIdByText[$leftText] = $leftId;
                    $insertLeft->execute([$leftId, $questionId, $leftText, $leftOrder]);
                } else {
                    $leftId = $leftIdByText[$leftText];
                }

                foreach ($rights as $rText) {
                    if (!isset($rightIdByText[$rText])) {
                        $rightOrder++;
                        $rightId = db_uuid($pdo);
                        $rightIdByText[$rText] = $rightId;
                        $insertRight->execute([$rightId, $questionId, $rText, $rightOrder]);
                    } else {
                        $rightId = $rightIdByText[$rText];
                    }

                    $pairId = db_uuid($pdo);
                    $insertPair->execute([$pairId, $questionId, $leftId, $rightId]);
                }
            }
        }
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "quiz_id" => $quizId,
        "slug" => $slug
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();

    error_log("SQL ERROR: " . $e->getMessage());
    error_log("SQL CODE: " . $e->getCode());
    error_log("SQL TRACE: " . $e->getTraceAsString());

    http_response_code(500);
    echo json_encode(["error" => "DB error"], JSON_UNESCAPED_UNICODE);
    exit;

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage(),
        "code" => $e->getCode()
    ], JSON_UNESCAPED_UNICODE);
}
