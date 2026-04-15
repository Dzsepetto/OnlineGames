<?php
require __DIR__ . "/../bootstrap.php";
require __DIR__ . "/../db.php";

// 🔥 JSON read
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
$answerId = (int)$data["answer_id"];
$pin = (string)$data["pin"];

// 🔥 question lekérés az answer alapján
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

// 🔥 SAVE
$pdo->prepare("
    INSERT INTO game_answers 
    (game_id, player_id, question_id, answer_id, is_correct)
    VALUES (?, ?, ?, ?, ?)
")->execute([$pin, $playerId, $questionId, $answerId, $isCorrect]);

// 🔥 SCORE
if ($isCorrect) {
    $pdo->prepare("
        UPDATE game_players 
        SET score = score + 100
        WHERE id = ?
    ")->execute([$playerId]);
}

echo json_encode(["ok" => true]);