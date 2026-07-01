<?php
// agrinexus-api/controllers/IoTController.php

require_once __DIR__ . '/../models/SensorReading.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';

class IoTController {
    public static function readings(): void {
        $payload = AuthMiddleware::requireRole('farmer');
        $hours   = min(168, max(1, (int)($_GET['hours'] ?? 24)));
        $readings = SensorReading::last24h($payload['user_id'], $hours);
        Response::success($readings);
    }

    public static function latestReadings(): void {
        $payload  = AuthMiddleware::requireRole('farmer');
        $readings = SensorReading::latest($payload['user_id']);
        Response::success($readings);
    }

    public static function alerts(): void {
        AuthMiddleware::requireRole('farmer');
        // In production: query sensor_readings for threshold violations.
        Response::success([
            ['msg' => 'Soil moisture below 40% — consider irrigation in Zone A', 'level' => 'warning', 'time' => '14:32'],
            ['msg' => 'Temperature spike detected in Zone B (26.8°C)',           'level' => 'warning', 'time' => '12:10'],
            ['msg' => 'All 12 sensors online and reporting normally',            'level' => 'ok',      'time' => '06:00'],
        ]);
    }

    public static function ingest(): void {
        // Called by IoT hardware/gateway to push sensor data
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = SensorReading::insert([
            'farm_id'       => $body['farm_id']       ?? 0,
            'temperature'   => $body['temperature']   ?? 0,
            'humidity'      => $body['humidity']       ?? 0,
            'soil_moisture' => $body['soil_moisture']  ?? 0,
            'light_level'   => $body['light_level']    ?? 0,
        ]);
        Response::success(['id' => $id], 'Reading recorded');
    }
}
