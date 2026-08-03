<?php
// agrinexus-api/config/cors.php
// Allow Vite dev server (port 5173) and production domain

$allowed = [
    'http://localhost:5173',
    'http://localhost:8000',
    'http://127.0.0.1:5173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowed = [];
if (!empty(getenv('ALLOWED_ORIGINS'))) {
    $allowed = array_map('trim', explode(',', getenv('ALLOWED_ORIGINS')));
} else {
    // sensible defaults for local development (Vite) — add production domains via ALLOWED_ORIGINS
    $allowed = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
    ];
}

if ($origin && in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Vary: Origin");
} else {
    // fallback for unspecified origins — keep permissive for demo/dev but encourage using ALLOWED_ORIGINS
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 3600');

// Preflight — browsers send OPTIONS before POST/PUT with custom headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
