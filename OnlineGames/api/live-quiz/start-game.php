<?php
require __DIR__ . "/../bootstrap.php";
require __DIR__ . "/../db.php";

// ========================================
// INPUT (JSON)
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (
    !is_array($data) ||
    empty($data["pin"])
) {
    http_response_code(400);
    echo json_encode(["error" => "Missing pin"]);
    exit;
}

$pin = (string)$data["pin"];

// ========================================
// UPDATE
$stmt = $pdo->prepare("
    UPDATE game_sessions
    SET state = 'playing',
        current_question_index = 0,
        question_started_at = NOW()
    WHERE id = ?
");

$stmt->execute([$pin]);

// ========================================
echo json_encode(["ok" => true]);