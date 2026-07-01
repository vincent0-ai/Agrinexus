<?php
// agrinexus-api/models/Product.php

require_once __DIR__ . '/../config/database.php';

class Product {
    public static function all(?string $category, ?string $county, string $sort, int $page, int $perPage): array {
        $db     = getDB();
        $where  = ['p.status != "deleted"'];
        $params = [];

        if ($category && $category !== 'All') { $where[] = 'p.category = ?'; $params[] = $category; }
        if ($county)                           { $where[] = 'u.county = ?';   $params[] = $county;   }

        $allowed = ['created_at', 'price', 'rating'];
        $orderBy = in_array($sort, $allowed, true) ? "p.$sort" : 'p.created_at';
        $offset  = ($page - 1) * $perPage;
        $whereStr = implode(' AND ', $where);

        $countSql = "SELECT COUNT(*) FROM products p JOIN users u ON u.id = p.farmer_id WHERE $whereStr";
        $total    = (int) $db->prepare($countSql)->execute($params) ? $db->query($countSql)->fetchColumn() : 0;

        $sql  = "SELECT p.*, u.full_name AS farmer_name, u.county
                 FROM products p JOIN users u ON u.id = p.farmer_id
                 WHERE $whereStr ORDER BY $orderBy DESC LIMIT $perPage OFFSET $offset";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return [$stmt->fetchAll(), $total];
    }

    public static function find(int $id): array|false {
        $db   = getDB();
        $stmt = $db->prepare("SELECT p.*, u.full_name AS farmer_name FROM products p JOIN users u ON u.id = p.farmer_id WHERE p.id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public static function byFarmer(int $farmerId): array {
        $db   = getDB();
        $stmt = $db->prepare("SELECT * FROM products WHERE farmer_id = ? AND status != 'deleted' ORDER BY created_at DESC");
        $stmt->execute([$farmerId]);
        return $stmt->fetchAll();
    }

    public static function create(array $data): array {
        $db  = getDB();
        $sql = "INSERT INTO products (farmer_id, name, category, price, unit, quantity, description, image_url, status, created_at, updated_at)
                VALUES (:farmer_id, :name, :category, :price, :unit, :quantity, :description, :image_url, :status, NOW(), NOW())";
        $db->prepare($sql)->execute($data);
        return self::find((int) $db->lastInsertId());
    }

    public static function update(int $id, array $data): array {
        $db      = getDB();
        $allowed = ['name', 'category', 'price', 'unit', 'quantity', 'description', 'image_url', 'status'];
        $sets    = [];
        $params  = [];
        foreach ($allowed as $field) {
            if (isset($data[$field])) { $sets[] = "$field = ?"; $params[] = $data[$field]; }
        }
        $params[] = $id;
        $db->prepare("UPDATE products SET " . implode(', ', $sets) . ", updated_at = NOW() WHERE id = ?")->execute($params);
        return self::find($id);
    }

    public static function delete(int $id): void {
        $db = getDB();
        $db->prepare("UPDATE products SET status = 'deleted', updated_at = NOW() WHERE id = ?")->execute([$id]);
    }
}
