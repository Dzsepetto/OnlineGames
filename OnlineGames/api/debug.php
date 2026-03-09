<?php

echo json_encode([
    "origin" => $_SERVER['HTTP_ORIGIN'] ?? null,
    "cookies" => $_COOKIE,
    "session" => $_SESSION ?? null
]);