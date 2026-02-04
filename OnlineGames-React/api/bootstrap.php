<?php
// api/bootstrap.php

$allowedOrigins = [
    "https://dzsepetto.hu",
    "https://www.dzsepetto.hu",
    "http://localhost:5173",
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Vary: Origin");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header("Content-Type: application/json; charset=utf-8");

$isLocal = strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false;

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => $isLocal ? null : '.dzsepetto.hu',
    'secure' => !$isLocal,
    'httponly' => true,
    'samesite' => $isLocal ? 'Lax' : 'None',
]);