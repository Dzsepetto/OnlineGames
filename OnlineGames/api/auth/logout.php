<?php
require __DIR__ . "/../bootstrap.php";

try {
    app_log("LOGOUT SESSION ID BEFORE: " . session_id());

    $_SESSION = [];

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();

        setcookie(
            session_name(),
            "",
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    session_destroy();

    json_success([
        "message" => "Sikeres kijelentkezés."
    ]);

} catch (Throwable $e) {
    app_log_exception("LOGOUT ERROR", $e);
    json_error("Nem sikerült kijelentkezni.", 500);
}