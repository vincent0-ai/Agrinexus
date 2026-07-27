<?php

ini_set('display_errors', 0);
error_reporting(0);

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/env.php';
require_once __DIR__ . '/middleware/RateLimitMiddleware.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/routes/api.php';

header('Content-Type: application/json');

RateLimitMiddleware::handle();

$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

try {
    dispatch($method, $path);
} catch (Throwable $e) {
    Response::error($e->getMessage(), 500);
}