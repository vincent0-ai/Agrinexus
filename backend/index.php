<?php

ini_set('display_errors', 0);
error_reporting(0);

try {
    require_once __DIR__ . '/config/cors.php';
    require_once __DIR__ . '/config/database.php';
    
    if (file_exists(__DIR__ . '/config/env.php')) {
        require_once __DIR__ . '/config/env.php';
    }

    if (!defined('JWT_SECRET'))       define('JWT_SECRET', getenv('JWT_SECRET') ?: 'super_secret_key_123');
    if (!defined('JWT_EXPIRES_IN'))   define('JWT_EXPIRES_IN', (int)(getenv('JWT_EXPIRES_IN') ?: 86400));
    if (!defined('GEMINI_API_KEY'))   define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');
    if (!defined('GEMINI_BASE_URL'))  define('GEMINI_BASE_URL', getenv('GEMINI_BASE_URL') ?: 'https://generativelanguage.googleapis.com/v1beta');
    if (!defined('DEEPSEEK_API_KEY')) define('DEEPSEEK_API_KEY', getenv('DEEPSEEK_API_KEY') ?: '');
    if (!defined('DEEPSEEK_BASE_URL'))define('DEEPSEEK_BASE_URL', getenv('DEEPSEEK_BASE_URL') ?: 'https://api.deepseek.com/v1');

    require_once __DIR__ . '/middleware/RateLimitMiddleware.php';
    require_once __DIR__ . '/utils/Response.php';
    require_once __DIR__ . '/routes/api.php';

    header('Content-Type: application/json');

    RateLimitMiddleware::handle();

    $method = $_SERVER['REQUEST_METHOD'];
    $path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    dispatch($method, $path);
} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}