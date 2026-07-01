<?php
// agrinexus-api/utils/Response.php

class Response {
    public static function json(mixed $data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function error(string $message, int $status = 400): void {
        self::json(['success' => false, 'message' => $message], $status);
    }

    public static function success(mixed $data = null, string $message = 'OK'): void {
        self::json(['success' => true, 'message' => $message, 'data' => $data]);
    }

    public static function paginate(array $items, int $total, int $page, int $perPage): void {
        self::json([
            'success'     => true,
            'data'        => $items,
            'pagination'  => [
                'total'        => $total,
                'page'         => $page,
                'per_page'     => $perPage,
                'total_pages'  => (int) ceil($total / $perPage),
            ],
        ]);
    }
}
