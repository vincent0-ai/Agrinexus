<?php
// agrinexus-api/models/MarketPrice.php

require_once __DIR__ . '/../config/database.php';

class MarketPrice {
    public static function byDateRange(string $cropName, int $months = 6): array {
        $db   = getDB();
        $stmt = $db->prepare(
            "SELECT price_per_kg, demand_index, county,
                    DATE_FORMAT(recorded_at, '%b') AS month, recorded_at
             FROM market_prices
             WHERE crop_name = ? AND recorded_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
             ORDER BY recorded_at ASC"
        );
        $stmt->execute([$cropName, $months]);
        return $stmt->fetchAll();
    }

    public static function latestPrices(): array {
        $db  = getDB();
        $sql = "SELECT crop_name, price_per_kg, demand_index
                FROM market_prices mp1
                WHERE recorded_at = (
                    SELECT MAX(recorded_at) FROM market_prices mp2 WHERE mp2.crop_name = mp1.crop_name
                )";
        return $db->query($sql)->fetchAll();
    }

    public static function insert(array $data): int {
        $db  = getDB();
        $sql = "INSERT INTO market_prices (crop_name, price_per_kg, demand_index, county, recorded_at)
                VALUES (:crop_name, :price_per_kg, :demand_index, :county, NOW())";
        $db->prepare($sql)->execute($data);
        return (int) $db->lastInsertId();
    }
}
