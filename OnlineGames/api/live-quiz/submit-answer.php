<?php
require __DIR__ . "/../bootstrap.php";
require __DIR__ . "/../db.php";

// ========================================
// INPUT
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (
    !is_array($data) ||
    empty($data["player_id"]) ||
    empty($data["answer_id"]) ||
    empty($data["pin"])
) {
    http_response_code(400);
    echo json_encode(["error" => "Missing data"]);
    exit;
}

$playerId = (int)$data["player_id"];
$answerId = $data["answer_id"];
$pin = (string)$data["pin"];

// ========================================
// ANSWER → QUESTION + CORRECTNESS
$stmt = $pdo->prepare("
    SELECT question_id, is_correct 
    FROM answer_option 
    WHERE id = ?
");
$stmt->execute([$answerId]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    http_response_code(404);
    echo json_encode(["error" => "Answer not found"]);
    exit;
}

$questionId = $row["question_id"];
$isCorrect = (int)$row["is_correct"];

// ========================================
// DUPLICATE CHECK
$stmt = $pdo->prepare("
    SELECT id FROM game_answers
    WHERE game_id = ? AND player_id = ? AND question_id = ?
");
$stmt->execute([$pin, $playerId, $questionId]);

if ($stmt->fetch()) {
    echo json_encode([
        "ok" => true,
        "duplicate" => true
    ]);
    exit;
}

// ========================================
// 🔥 GET QUESTION START TIME
$stmt = $pdo->prepare("
    SELECT question_started_at 
    FROM game_sessions 
    WHERE id = ?
");
$stmt->execute([$pin]);
$game = $stmt->fetch(PDO::FETCH_ASSOC);

$startedAt = $game["question_started_at"] ?? null;

// ========================================
// SAVE
$pdo->prepare("
    INSERT INTO game_answers 
    (game_id, player_id, question_id, answer_id, is_correct, started_at)
    VALUES (?, ?, ?, ?, ?, ?)
")->execute([
    $pin,
    $playerId,
    $questionId,
    $answerId,
    $isCorrect,
    $startedAt
]);

echo json_encode([
    "ok" => true,
    "correct" => (bool)$isCorrect
]);