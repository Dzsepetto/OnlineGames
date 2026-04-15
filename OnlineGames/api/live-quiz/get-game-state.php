<?php
require __DIR__ . "/../bootstrap.php";
require __DIR__ . "/../db.php";

// ========================================
// INPUT
$pin = $_GET["pin"] ?? null;

if (!$pin) {
    http_response_code(400);
    echo json_encode(["error" => "Missing pin"]);
    exit;
}

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
// PLAYERS
$stmt = $pdo->prepare("
    SELECT id, name, score
    FROM game_players
    WHERE game_id = ?
    ORDER BY id ASC
");
$stmt->execute([$pin]);
$players = $stmt->fetchAll(PDO::FETCH_ASSOC);

// ========================================
// QUESTION (ha playing)
$question = null;

if ($game["state"] === "playing") {

    // ❗ FIX: OFFSET helyett LIMIT offset, count
    $index = (int)$game["current_question_index"];

    $stmt = $pdo->prepare("
        SELECT *
        FROM question
        WHERE quiz_id = ?
        ORDER BY order_index ASC
        LIMIT $index, 1
    ");
    $stmt->execute([$game["quiz_id"]]);

    $q = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($q) {

        // válaszok
        $stmt = $pdo->prepare("
            SELECT id, label
            FROM answer_option
            WHERE question_id = ?
            ORDER BY order_index ASC
        ");
        $stmt->execute([$q["id"]]);
        $answersRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $answers = array_map(function ($a, $i) {
            return [
                "id" => $a["id"],
                "index" => $i
            ];
        }, $answersRaw);

        $question = [
            "id" => $q["id"],
            "text" => $q["question_text"],
            "type" => $q["type"],
            "answers" => $answers
        ];
    }
}

// ========================================
echo json_encode([
    "game" => [
        "state" => $game["state"],
        "current_question_index" => (int)$game["current_question_index"]
    ],
    "players" => $players,
    "question" => $question
]);