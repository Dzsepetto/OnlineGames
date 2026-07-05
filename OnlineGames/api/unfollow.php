<?php
require __DIR__ . "/bootstrap.php";
require __DIR__ . "/db.php";

$userId = require_user_id();

$data = read_json_body();
$targetId = (int)($data["user_id"] ?? 0);

if ($targetId <= 0) {
    json_error("Hiányzó felhasználó.", 400);
}

try {

    $stmt = $pdo->prepare("
        delete from user_follows
        where follower_id = ?
        and following_id = ?
    ");

    $stmt->execute([
        $userId,
        $targetId
    ]);

    json_success([
        "following" => false
    ]);

} catch (Throwable $e) {
    app_log_exception("UNFOLLOW ERROR:", $e);
    json_error("Nem sikerült kikövetni a felhasználót.", 500);
}