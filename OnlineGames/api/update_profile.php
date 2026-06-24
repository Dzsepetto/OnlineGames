<?php
require __DIR__ . "/bootstrap.php";
require __DIR__ . "/db.php";

try {
    if (!isset($_SESSION["user_id"])) {
        json_error("Nincs bejelentkezve!", 401);
    }

    $userId = (int)$_SESSION["user_id"];

    $inputData = json_decode(file_get_contents("php://input"), true);

    if (!$inputData) {
        json_error("Hiányzó vagy érvénytelen adatok.", 400);
    }

    $nickname = isset($inputData["nickname"]) ? trim((string)$inputData["nickname"]) : null;
    $description = isset($inputData["description"]) ? trim((string)$inputData["description"]) : null;

    if ($nickname !== null && mb_strlen($nickname) > 80) {
        json_error("A becenév maximum 80 karakter lehet.", 400);
    }

    if ($description !== null && mb_strlen($description) > 255) {
        json_error("A bemutatkozás maximum 255 karakter lehet.", 400);
    }

    $fieldsToUpdate = [];
    $params = [];

    if ($nickname !== null) {
        $fieldsToUpdate[] = "nickname = ?";
        $params[] = $nickname;
    }

    if ($description !== null) {
        $fieldsToUpdate[] = "description = ?";
        $params[] = $description;
    }

    if (empty($fieldsToUpdate)) {
        json_error("Nem történt változtatás.", 400);
    }

    $params[] = $userId;

    $sql = "UPDATE users SET " . implode(", ", $fieldsToUpdate) . " WHERE id = ? LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    json_success([
        "message" => "Profil sikeresen frissítve.",
        "updated" => [
            "nickname" => $nickname,
            "description" => $description
        ]
    ]);

} catch (Throwable $e) {
    app_log_exception("PROFILE UPDATE ERROR", $e);

    json_error(
        ENV === "local"
            ? $e->getMessage()
            : "Nem sikerült a profil frissítése.",
        500
    );
}