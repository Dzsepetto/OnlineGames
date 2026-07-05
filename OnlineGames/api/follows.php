<?php
require __DIR__ . "/bootstrap.php";
require __DIR__ . "/db.php";

$userId = require_user_id();

try {
    $followersStmt = $pdo->prepare("
        select
            u.id,
            u.name,
            u.nickname,
            u.description
        from user_follows uf
        join users u on u.id = uf.follower_id
        where uf.following_id = ?
        order by uf.created_at desc
    ");
    $followersStmt->execute([$userId]);
    $followers = $followersStmt->fetchAll();

    $followingStmt = $pdo->prepare("
        select
            u.id,
            u.name,
            u.nickname,
            u.description
        from user_follows uf
        join users u on u.id = uf.following_id
        where uf.follower_id = ?
        order by uf.created_at desc
    ");
    $followingStmt->execute([$userId]);
    $following = $followingStmt->fetchAll();

    json_success([
        "followers" => $followers,
        "following" => $following,
        "followers_count" => count($followers),
        "following_count" => count($following)
    ]);

} catch (Throwable $e) {
    app_log_exception("GET FOLLOWS ERROR: ", $e);
    json_error("Nem sikerült betölteni a követéseket.", 500);
}