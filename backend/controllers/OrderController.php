<?php
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class OrderController {
    public static function index(): void {
        $payload = AuthMiddleware::handle();
        $status  = $_GET['status'] ?? null;
        $orders  = Order::allForUser($payload['user_id'], $payload['role'], $status);
        Response::success($orders);
    }

    public static function show(int $id): void {
        $payload = AuthMiddleware::handle();
        $order   = Order::find($id);
        if (!$order) Response::error('Order not found', 404);

        $isOwner = ($payload['role'] === 'buyer'  && $order['buyer_id']  === $payload['user_id'])
                || ($payload['role'] === 'farmer' && $order['farmer_id'] === $payload['user_id']);
        if (!$isOwner) Response::error('Forbidden', 403);

        Response::success($order);
    }

    public static function store(): void {
        $payload = AuthMiddleware::requireRole('buyer');
        $body    = json_decode(file_get_contents('php://input'), true) ?? [];

        $v = (new Validator($body))
            ->required('product_id')
            ->required('farmer_id')
            ->required('quantity')
            ->required('total_price')
            ->required('delivery_address')
            ->numeric('product_id')
            ->numeric('farmer_id')
            ->numeric('quantity')
            ->numeric('total_price');

        if ($v->fails()) Response::error(implode(', ', $v->errors()));

        $order = Order::create([
            'product_id'       => (int)$body['product_id'],
            'buyer_id'         => $payload['user_id'],
            'farmer_id'        => (int)$body['farmer_id'],
            'quantity'         => (int)$body['quantity'],
            'total_price'      => (float)$body['total_price'],
            'delivery_address' => $body['delivery_address'],
            'status'           => 'pending',
        ]);

        Response::success($order, 'Order placed successfully');
    }

    public static function updateStatus(int $id): void {
        $payload = AuthMiddleware::requireRole('farmer');
        $order   = Order::find($id);
        if (!$order) Response::error('Order not found', 404);
        if ($order['farmer_id'] !== $payload['user_id']) Response::error('Forbidden', 403);

        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $v    = (new Validator($body))
            ->required('status')
            ->in('status', ['pending', 'confirmed', 'delivered', 'cancelled']);
        if ($v->fails()) Response::error(implode(', ', $v->errors()));

        $updated = Order::updateStatus($id, $body['status']);
        Response::success($updated, 'Status updated');
    }
}