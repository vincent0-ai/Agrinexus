<?php
// agrinexus-api/middleware/AuthMiddleware.php

require_once __DIR__ . '/../services/JWTService.php';
require_once __DIR__ . '/../utils/Response.php';

class AuthMiddleware {
    public static function handle(): array {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (!str_starts_with($authHeader, 'Bearer ')) {
            Response::error('Unauthorized — missing token', 401);
        }

        $token   = substr($authHeader, 7);
        $payload = JWTService::validate($token);

        if (!$payload) {
            Response::error('Unauthorized — invalid or expired token', 401);
        }

        return $payload; // returns ['user_id' => ..., 'role' => ..., ...]
    }

    public static function requireRole(string $role): array {
        $payload = self::handle();
        if ($payload['role'] !== $role) {
            Response::error("Forbidden — $role access required", 403);
        }
        return $payload;
    }
}
