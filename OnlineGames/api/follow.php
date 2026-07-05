<?php
require __DIR__ . "/bootstrap.php";
require __DIR__ . "/db.php";

$userId = require_user_id();

$data = read_json_body();
$targetId = (int)($data["user_id"] ?? 0);

if ($targetId <= 0) {
    json_error("Hiányzó felhasználó.", 400);
}

if ($targetId === $userId) {
    json_error("Saját magadat nem követheted.", 400);
}

try {

    $stmt = $pdo->prepare("
        select id
        from users
        where id = ?
        limit 1
    ");
    $stmt->execute([$targetId]);

    if (!$stmt->fetch()) {
        json_error("Felhasználó nem található.", 404);
    }

    $stmt = $pdo->prepare("
        insert ignore into user_follows
        (follower_id, following_id)
        values (?, ?)
    ");

    $stmt->execute([
        $userId,
        $targetId
    ]);

    json_success([
        "following" => true
    ]);

} catch (Throwable $e) {
    app_log_exception("FOLLOW ERROR:", $e);
    json_error("Nem sikerült követni a felhasználót.", 500);
}