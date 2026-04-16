<?php
require __DIR__ . "/../bootstrap.php";
require __DIR__ . "/../db.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

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
// PLAYERS + 🔥 TIME-BASED SCORE
$stmt = $pdo->prepare("
    SELECT 
        gp.id,
        gp.name,
        COALESCE(SUM(
            CASE 
                WHEN ga.is_correct = 1 AND ga.started_at IS NOT NULL THEN 
                    1000 - LEAST(
                        TIMESTAMPDIFF(SECOND, ga.started_at, ga.answered_at) * 100,
                        800
                    )
                ELSE 0
            END
        ), 0) AS score
    FROM game_players gp
    LEFT JOIN game_answers ga 
        ON gp.id = ga.player_id 
        AND gp.game_id = ga.game_id
    WHERE gp.game_id = ?
    GROUP BY gp.id, gp.name
    ORDER BY score DESC
");
$stmt->execute([$pin]);
$players = $stmt->fetchAll(PDO::FETCH_ASSOC);

// ========================================
// DEFAULTS
$question = null;
$answeredCount = 0;

// ========================================
// QUESTION + ANSWER COUNT
if ($game["state"] === "playing") {

    $index = intval($game["current_question_index"]);
    if ($index < 0) $index = 0;

    // aktuális kérdés
    $stmt = $pdo->prepare("
        SELECT id, question_text, type
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

        $answers = array_map(function ($a) {
            return [
                "id" => $a["id"],
                "text" => $a["label"]
            ];
        }, $answersRaw);

        $question = [
            "id" => $q["id"],
            "text" => $q["question_text"],
            "type" => $q["type"],
            "answers" => $answers
        ];

        // ========================================
        // ANSWER COUNT
        $stmt = $pdo->prepare("
            SELECT COUNT(DISTINCT player_id)
            FROM game_answers
            WHERE game_id = ?
            AND question_id = ?
        ");
        $stmt->execute([$pin, $q["id"]]);
        $answeredCount = (int)$stmt->fetchColumn();
    }
}

// ========================================
header("Content-Type: application/json");

echo json_encode([
    "game" => [
        "state" => $game["state"],
        "current_question_index" => (int)$game["current_question_index"]
    ],
    "players" => $players,
    "question" => $question,
    "answers_count" => $answeredCount
]);