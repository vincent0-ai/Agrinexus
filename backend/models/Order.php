<?php
// agrinexus-api/models/Order.php

require_once __DIR__ . '/../config/database.php';

class Order {
    public static function allForUser(int $userId, string $role, ?string $status): array {
        $db     = getDB();
        $col    = $role === 'farmer' ? 'o.farmer_id' : 'o.buyer_id';
        $where  = ["$col = ?"];
        $params = [$userId];

        if ($status && $status !== 'All') {
            $where[]  = 'o.status = ?';
            $params[] = strtolower($status);
        }

        $whereStr = implode(' AND ', $where);
        $sql = "SELECT o.*, p.name AS product_name,
                       b.full_name AS buyer_name, f.full_name AS farmer_name
                FROM orders o
                JOIN products p ON p.id = o.product_id
                JOIN users b ON b.id = o.buyer_id
                JOIN users f ON f.id = o.farmer_id
                WHERE $whereStr ORDER BY o.created_at DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function find(int $id): array|false {
        $db  = getDB();
        $sql = "SELECT o.*, p.name AS product_name,
                       b.full_name AS buyer_name, f.full_name AS farmer_name
                FROM orders o
                JOIN products p ON p.id = o.product_id
                JOIN users b ON b.id = o.buyer_id
                JOIN users f ON f.id = o.farmer_id
                WHERE o.id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public static function updateStatus(int $id, string $status): array {
        $db = getDB();
        $db->prepare("UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?")
           ->execute([$status, $id]);
        return self::find($id);
    }

    public static function create(array $data): array {
        $db  = getDB();
        $sql = "INSERT INTO orders
                    (product_id, buyer_id, farmer_id, quantity, total_price, delivery_address, status)
                VALUES
                    (:product_id, :buyer_id, :farmer_id, :quantity, :total_price, :delivery_address, :status)";

        $db->prepare($sql)->execute([
            ':product_id'       => $data['product_id'],
            ':buyer_id'         => $data['buyer_id'],
            ':farmer_id'        => $data['farmer_id'],
            ':quantity'         => $data['quantity'],
            ':total_price'      => $data['total_price'],
            ':delivery_address' => $data['delivery_address'],
            ':status'           => $data['status'],
        ]);

        return self::find((int)$db->lastInsertId());
    }
}