<?php
require_once __DIR__ . '/config/env.php';

$allowedOriginsRaw = env('ALLOWED_ORIGINS', '');
$allowedOrigins = array_values(array_filter(array_map('trim', explode(',', $allowedOriginsRaw))));

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

if ($origin && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Vary: Origin");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header("Content-Type: application/json; charset=utf-8");

if (ENV === 'local') {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
} else {
    $sessionDomain = env('SESSION_DOMAIN', '.dzsepetto.hu');

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => $sessionDomain,
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None',
    ]);
}

session_start();
