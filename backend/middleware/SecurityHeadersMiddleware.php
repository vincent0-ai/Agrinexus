<?php
// middleware/SecurityHeadersMiddleware.php
class SecurityHeadersMiddleware
{
    public static function apply()
    {
        // Prevent MIME sniffing
        header('X-Content-Type-Options: nosniff');

        // Clickjacking protection
        header('X-Frame-Options: DENY');

        // Referrer policy
        header('Referrer-Policy: no-referrer');

        // Basic permissions policy (feature-policy replacement)
        header("Permissions-Policy: geolocation=(), microphone=(), camera=()");

        // HSTS (only over HTTPS in production)
        if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
            header('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');
        }

        // Content-Security-Policy: keep fairly strict but allow dev tools and external APIs
        header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https: wss:; img-src 'self' https: data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:;");
    }
}
