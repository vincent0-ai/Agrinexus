<?php
// agrinexus-api/models/SensorReading.php

require_once __DIR__ . '/../config/database.php';

class SensorReading {

    /**
     * Store a new sensor reading
     */
    public static function create(array $data): array {
        $db  = getDB();

        // Add tank_level and valve_status columns if not in schema
        // Run this SQL in phpMyAdmin:
        // ALTER TABLE sensor_readings
        //   ADD COLUMN tank_level INT DEFAULT 0,
        //   ADD COLUMN valve_status VARCHAR(10) DEFAULT 'CLOSED',
        //   ADD COLUMN farm_status VARCHAR(20) DEFAULT 'Unknown';

        $sql = "INSERT INTO sensor_readings
                    (farm_id, temperature, humidity,
                     soil_moisture, light_level, recorded_at)
                VALUES
                    (:farm_id, :temperature, :humidity,
                     :soil_moisture, :light_level, NOW())";

        $db->prepare($sql)->execute([
            ':farm_id'       => $data['farm_id'],
            ':temperature'   => $data['temperature'],
            ':humidity'      => $data['humidity'],
            ':soil_moisture' => $data['soil_moisture'],
            ':light_level'   => $data['light_level'],
        ]);

        return self::find((int)$db->lastInsertId());
    }

    /**
     * Get single reading by ID
     */
    public static function find(int $id): array|false {
        $db   = getDB();
        $stmt = $db->prepare(
            "SELECT * FROM sensor_readings WHERE id = ?"
        );
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    /**
     * Get latest reading for a specific farmer
     */
    public static function latest(int $farmId): array|false {
        $db   = getDB();
        $stmt = $db->prepare(
            "SELECT * FROM sensor_readings
             WHERE farm_id = ?
             ORDER BY recorded_at DESC
             LIMIT 1"
        );
        $stmt->execute([$farmId]);
        return $stmt->fetch();
    }

    /**
     * Get last 24 hours of readings for charts
     * Returns one reading per hour (average)
     */
    public static function last24Hours(int $farmId): array {
        $db   = getDB();
        $stmt = $db->prepare(
            "SELECT
                DATE_FORMAT(recorded_at, '%H:00') AS hour,
                ROUND(AVG(temperature), 1)   AS temperature,
                ROUND(AVG(humidity), 1)       AS humidity,
                ROUND(AVG(soil_moisture), 1)  AS soil_moisture,
                ROUND(AVG(light_level), 0)    AS light_level
             FROM sensor_readings
             WHERE farm_id = ?
               AND recorded_at >= NOW() - INTERVAL 24 HOUR
             GROUP BY DATE_FORMAT(recorded_at, '%H:00')
             ORDER BY MIN(recorded_at) ASC"
        );
        $stmt->execute([$farmId]);
        return $stmt->fetchAll();
    }

    /**
     * Get readings for the last N hours
     */
    public static function lastNHours(int $farmId, int $hours = 24): array {
        $db   = getDB();
        $stmt = $db->prepare(
            "SELECT * FROM sensor_readings
             WHERE farm_id = ?
               AND recorded_at >= NOW() - INTERVAL ? HOUR
             ORDER BY recorded_at ASC"
        );
        $stmt->execute([$farmId, $hours]);
        return $stmt->fetchAll();
    }
}