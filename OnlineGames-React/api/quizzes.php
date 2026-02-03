<?php

$allowedOrigins = [
    "https://dzsepetto.hu",
    "https://www.dzsepetto.hu",
];

if (
    isset($_SERVER["HTTP_ORIGIN"]) &&
    in_array($_SERVER["HTTP_ORIGIN"], $allowedOrigins, true)
) {
    header("Access-Control-Allow-Origin: " . $_SERVER["HTTP_ORIGIN"]);
    header("Vary: Origin");
}

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

header("Content-Type: application/json; charset=utf-8");

require __DIR__ . "/db.php";

$sql = "
    SELECT 
        ID,
        SLUG,
        TITLE,
        DESCRIPTION
    FROM QUIZ
    WHERE IS_PUBLISHED = 1
    ORDER BY CREATED_AT DESC
";

$stmt = $pdo->query($sql);
$quizzes = $stmt->fetchAll();

echo json_encode($quizzes, JSON_UNESCAPED_UNICODE);
