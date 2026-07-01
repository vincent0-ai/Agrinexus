<?php
// agrinexus-api/middleware/RateLimitMiddleware.php
// Simple per-IP rate limiting using APCu (available in XAMPP with PHP >= 8)
// Falls back gracefully if APCu is not enabled.

class RateLimitMiddleware {
    private const MAX_REQUESTS = 120; // per window
    private const WINDOW_SEC   = 60;  // 1 minute

    public static function handle(): void {
        if (!function_exists('apcu_fetch')) return; // APCu not available — skip

        $ip  = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $key = "rate_limit_$ip";

        $count = apcu_fetch($key, $exists);

        if (!$exists) {
            apcu_store($key, 1, self::WINDOW_SEC);
            return;
        }

        if ($count >= self::MAX_REQUESTS) {
            http_response_code(429);
            die(json_encode(['error' => 'Too many requests — please slow down']));
        }

        apcu_inc($key);
    }
}
