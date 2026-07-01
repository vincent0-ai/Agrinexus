<?php
// require_once __DIR__ . '/config/database.php';

// try {
//     $pdo = getDB();
//     $tables = $pdo->query("SHOW TABLES")->fetchAll();
//     echo json_encode([
//         'status' => 'Connected!',
//         'tables' => array_map('array_values', $tables)
//     ], JSON_PRETTY_PRINT);
// } catch (Exception $e) {
//     echo json_encode(['error' => $e->getMessage()]);
// }


require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/env.php';
require_once __DIR__ . '/utils/Response.php';

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/models/Order.php';
    
    $test = Order::create([
        'product_id'       => 1,
        'buyer_id'         => 2,
        'farmer_id'        => 1,
        'quantity'         => 5,
        'total_price'      => 250.00,
        'delivery_address' => 'Test Address, Nairobi',
        'status'           => 'pending',
    ]);

    echo json_encode(['success' => true, 'order' => $test]);
} catch (Throwable $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'file'  => $e->getFile(),
        'line'  => $e->getLine()
    ]);
}