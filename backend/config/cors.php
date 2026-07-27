<?php
// agrinexus-api/config/cors.php
// Allow Vite dev server (port 5173) and production domain

$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

if ($origin && $origin !== '*') {
    header("Access-Control-Allow-Origin: $origin");
    header("Vary: Origin");
} else {
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
