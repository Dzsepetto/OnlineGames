<?php
require __DIR__ . "/bootstrap.php";
require __DIR__ . "/db.php";

$key = $_GET["slug"] ?? null;

if (!$key) {
    http_response_code(400);
    echo json_encode(["error" => "Missing quiz slug/id"]);
    exit;
}

$quizStmt = $pdo->prepare("
    SELECT ID, TITLE, DESCRIPTION
    FROM QUIZ
    WHERE SLUG = ? OR ID = ?
    LIMIT 1
");
$quizStmt->execute([$key, $key]);
$quiz = $quizStmt->fetch(PDO::FETCH_ASSOC);

if (!$quiz) {
    http_response_code(404);
    echo json_encode(["error" => "Quiz not found"]);
    exit;
}

$questionStmt = $pdo->prepare("
    SELECT ID, QUESTION_TEXT, TYPE
    FROM QUESTION
    WHERE QUIZ_ID = ?
    ORDER BY ORDER_INDEX, ID
");
$questionStmt->execute([$quiz["ID"]]);
$questions = $questionStmt->fetchAll(PDO::FETCH_ASSOC);

$answerStmt = $pdo->prepare("
    SELECT
        LABEL AS ANSWER_TEXT,
        IS_CORRECT
    FROM ANSWER_OPTION
    WHERE QUESTION_ID = ?
    ORDER BY ORDER_INDEX, ID
");

$pairStmt = $pdo->prepare("
    SELECT
        P.LEFT_ID,
        L.TEXT AS LEFT_TEXT,
        P.RIGHT_ID,
        R.TEXT AS RIGHT_TEXT
    FROM MATCHING_PAIR P
    JOIN MATCHING_LEFT_ITEM L ON L.ID = P.LEFT_ID
    JOIN MATCHING_RIGHT_ITEM R ON R.ID = P.RIGHT_ID
    WHERE P.QUESTION_ID = ?
    ORDER BY L.ORDER_INDEX, R.ORDER_INDEX, P.ID
");

foreach ($questions as &$q) {
    if (($q["TYPE"] ?? "") === "MATCHING") {
        $pairStmt->execute([$q["ID"]]);
        $rows = $pairStmt->fetchAll(PDO::FETCH_ASSOC);

        // LEFT_ID -> aggregated rights
        $byLeft = [];

        foreach ($rows as $row) {
            $leftId = $row["LEFT_ID"];
            if (!isset($byLeft[$leftId])) {
                $byLeft[$leftId] = [
                    "ID" => $leftId,
                    "LEFT" => [ (string)$row["LEFT_TEXT"] ],
                    "RIGHT" => [],
                ];
            }
            $byLeft[$leftId]["RIGHT"][] = (string)$row["RIGHT_TEXT"];
        }

        // Keep order as produced by SQL
        $q["GROUPS"] = array_values($byLeft);
    } else {
        $answerStmt->execute([$q["ID"]]);
        $q["ANSWERS"] = $answerStmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

$quiz["QUESTIONS"] = $questions;

echo json_encode(["QUIZ" => $quiz], JSON_UNESCAPED_UNICODE);
