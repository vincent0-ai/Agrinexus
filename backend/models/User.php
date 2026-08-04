<?php
// agrinexus-api/models/User.php

require_once __DIR__ . '/../config/database.php';

class User {
    public static function find(int $id): array|false {
        $db   = getDB();
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public static function findByEmail(string $email): array|false {
        $db   = getDB();
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public static function create(array $data): array {
        $db  = getDB();
        $sql = "INSERT INTO users (full_name, email, password_hash, role, county, created_at, updated_at)
                VALUES (:full_name, :email, :password_hash, :role, :county, NOW(), NOW())";
        $stmt = $db->prepare($sql);
        $stmt->execute($data);
        return self::find((int) $db->lastInsertId());
    }

    public static function update(int $id, array $data): array {
        $db = getDB();
        $sql = "UPDATE users SET full_name = :full_name, email = :email, county = :county, updated_at = NOW() WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            'full_name' => $data['full_name'],
            'email'     => $data['email'],
            'county'    => $data['county'] ?? '',
            'id'        => $id
        ]);
        return self::find($id);
    }

    public static function updatePassword(int $id, string $passwordHash): void {
        $db = getDB();
        $sql = "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$passwordHash, $id]);
    }

    public static function toPublic(array $user): array {
        unset($user['password_hash']);
        return $user;
    }
}
