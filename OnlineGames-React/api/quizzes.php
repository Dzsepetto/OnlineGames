<?php
require __DIR__ . "/bootstrap.php";
require __DIR__ . "/db.php";

$sql = "
    SELECT 
        Q.ID, 
        Q.SLUG, 
        Q.TITLE, 
        Q.DESCRIPTION,
        U.NAME AS CREATOR_NAME
    FROM QUIZ Q
    LEFT JOIN USERS U ON Q.CREATED_BY = U.ID
    WHERE Q.IS_PUBLISHED = 1
    ORDER BY Q.CREATED_AT DESC
";

try {
    $stmt = $pdo->query($sql);
    $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode($quizzes, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "SQL hiba: " . $e->getMessage()]);
}