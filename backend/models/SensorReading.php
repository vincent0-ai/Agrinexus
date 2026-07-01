<?php
// agrinexus-api/models/SensorReading.php

require_once __DIR__ . '/../config/database.php';

class SensorReading {
    public static function last24h(int $farmId, int $hours = 24): array {
        $db   = getDB();
        $stmt = $db->prepare(
            "SELECT temperature, humidity, soil_moisture, light_level,
                    DATE_FORMAT(recorded_at, '%H:%i') AS time
             FROM sensor_readings
             WHERE farm_id = ? AND recorded_at >= DATE_SUB(NOW(), INTERVAL ? HOUR)
             ORDER BY recorded_at ASC"
        );
        $stmt->execute([$farmId, $hours]);
        return $stmt->fetchAll();
    }

    public static function latest(int $farmId): array {
        $db   = getDB();
        $stmt = $db->prepare(
            "SELECT temperature, humidity, soil_moisture, light_level, recorded_at
             FROM sensor_readings WHERE farm_id = ? ORDER BY recorded_at DESC LIMIT 10"
        );
        $stmt->execute([$farmId]);
        return $stmt->fetchAll();
    }

    public static function insert(array $data): int {
        $db  = getDB();
        $sql = "INSERT INTO sensor_readings (farm_id, temperature, humidity, soil_moisture, light_level, recorded_at)
                VALUES (:farm_id, :temperature, :humidity, :soil_moisture, :light_level, NOW())";
        $db->prepare($sql)->execute($data);
        return (int) $db->lastInsertId();
    }
}
