<?php
require __DIR__ . "/bootstrap.php";
require __DIR__ . "/db.php";

$currentUserId = require_user_id();
$nickname = trim((string)($_GET["nickname"] ?? ""));

try {
    if ($nickname === "") {
        $stmt = $pdo->prepare("
            select id, email, name, nickname, description
            from users
            where id = ?
            limit 1
        ");
        $stmt->execute([$currentUserId]);
    } else {
        $stmt = $pdo->prepare("
            select id, email, name, nickname, description
            from users
            where nickname = ?
            limit 1
        ");
        $stmt->execute([$nickname]);
    }

    $profile = $stmt->fetch();

    if (!$profile) {
        json_error("Profil nem található.", 404);
    }

    $profileUserId = (int)$profile["id"];
    $isOwnProfile = $profileUserId === (int)$currentUserId;

    $followersStmt = $pdo->prepare("
        select count(*)
        from user_follows
        where following_id = ?
    ");
    $followersStmt->execute([$profileUserId]);
    $followersCount = (int)$followersStmt->fetchColumn();

    $followingStmt = $pdo->prepare("
        select count(*)
        from user_follows
        where follower_id = ?
    ");
    $followingStmt->execute([$profileUserId]);
    $followingCount = (int)$followingStmt->fetchColumn();

    $followStmt = $pdo->prepare("
        select 1
        from user_follows
        where follower_id = ?
        and following_id = ?
        limit 1
    ");
    $followStmt->execute([$currentUserId, $profileUserId]);
    $isFollowing = (bool)$followStmt->fetchColumn();

    json_success([
        "profile" => $profile,
        "is_own_profile" => $isOwnProfile,
        "is_following" => $isFollowing,
        "followers_count" => $followersCount,
        "following_count" => $followingCount
    ]);

} catch (Throwable $e) {
    app_log_exception("GET PROFILE ERROR: ", $e);
    json_error("Nem sikerült betölteni a profilt.", 500);
}