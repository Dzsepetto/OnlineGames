<?php
require __DIR__ . "/../bootstrap.php";
require __DIR__ . "/../db.php";

// ========================================
// INPUT
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (
    json_last_error() !== JSON_ERROR_NONE ||
    empty($data["pin"])
) {
    http_response_code(400);
    echo json_encode(["error" => "Missing pin"]);
    exit;
}

$pin = (string)$data["pin"];

// ========================================
// GAME
$stmt = $pdo->prepare("
    SELECT *
    FROM game_sessions
    WHERE id = ?
    LIMIT 1
");
$stmt->execute([$pin]);
$game = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$game) {
    http_response_code(404);
    echo json_encode(["error" => "Game not found"]);
    exit;
}

// ========================================
// KÖVETKEZŐ KÉRDÉS INDEX
$nextIndex = (int)$game["current_question_index"] + 1;

// hány kérdés van?
$stmt = $pdo->prepare("
    SELECT COUNT(*) 
    FROM question
    WHERE quiz_id = ?
");
$stmt->execute([$game["quiz_id"]]);
$totalQuestions = (int)$stmt->fetchColumn();

// ========================================
// HA VÉGE
if ($nextIndex >= $totalQuestions) {

    $pdo->prepare("
        UPDATE game_sessions
        SET state = 'finished'
        WHERE id = ?
    ")->execute([$pin]);

    echo json_encode(["ok" => true, "finished" => true]);
    exit;
}

// ========================================
// UPDATE
$pdo->prepare("
    UPDATE game_sessions
    SET current_question_index = ?,
        question_started_at = NOW()
    WHERE id = ?
")->execute([$nextIndex, $pin]);

echo json_encode([
    "ok" => true,
    "next_index" => $nextIndex
]);