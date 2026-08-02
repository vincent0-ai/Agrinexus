<?php
require_once __DIR__ . '/../models/SensorReading.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';

class IoTController {

    /**
     * GET /iot/latest
     * Returns latest reading for the logged-in farmer
     */
    public static function latestReadings(): void {
        $payload  = AuthMiddleware::handle();
        $reading  = SensorReading::latest($payload['user_id']);
        if (!$reading) {
            Response::success(null, 'No readings yet');
            return;
        }
        Response::success($reading);
    }

    /**
     * GET /iot/readings
     * Returns last 24 hours of readings for charts
     */
    public static function readings(): void {
        $payload  = AuthMiddleware::handle();
        $readings = SensorReading::last24Hours($payload['user_id']);
        Response::success($readings);
    }

    /**
     * GET /iot/alerts
     * Returns active alerts based on latest reading
     */
    public static function alerts(): void {
        $payload = AuthMiddleware::handle();
        $reading = SensorReading::latest($payload['user_id']);
        $alerts  = [];

        if (!$reading) {
            Response::success([]);
            return;
        }

        // Check each sensor threshold
        if ($reading['soil_moisture'] < 30) {
            $alerts[] = [
                'level' => 'warning',
                'msg'   => 'Soil moisture critically low — irrigation recommended',
                'time'  => date('H:i', strtotime($reading['recorded_at'])),
            ];
        }
        if ($reading['temperature'] > 35) {
            $alerts[] = [
                'level' => 'warning',
                'msg'   => 'High temperature detected — check crop shade',
                'time'  => date('H:i', strtotime($reading['recorded_at'])),
            ];
        }
        if (isset($reading['tank_level']) && $reading['tank_level'] < 20) {
            $alerts[] = [
                'level' => 'warning',
                'msg'   => 'Water tank below 20% — refill soon',
                'time'  => date('H:i', strtotime($reading['recorded_at'])),
            ];
        }
        if ($reading['humidity'] < 30) {
            $alerts[] = [
                'level' => 'warning',
                'msg'   => 'Low humidity — consider misting crops',
                'time'  => date('H:i', strtotime($reading['recorded_at'])),
            ];
        }
        if (empty($alerts)) {
            $alerts[] = [
                'level' => 'good',
                'msg'   => 'All sensors within normal range',
                'time'  => date('H:i', strtotime($reading['recorded_at'])),
            ];
        }

        Response::success($alerts);
    }

    /**
     * POST /iot/ingest
     * Receives data from Arduino (via Python bridge or ESP32)
     */
    public static function ingest(): void {
        $payload = AuthMiddleware::handle();
        $body    = json_decode(file_get_contents('php://input'), true) ?? [];

        // Validate required fields
        $required = ['temperature', 'humidity', 'soil_moisture', 'light_level'];
        foreach ($required as $field) {
            if (!isset($body[$field])) {
                Response::error("Missing field: $field", 400);
            }
        }

        // Store reading linked to this farmer
        $reading = SensorReading::create([
            'farm_id'      => $payload['user_id'],
            'temperature'  => (float)$body['temperature'],
            'humidity'     => (float)$body['humidity'],
            'soil_moisture'=> (float)$body['soil_moisture'],
            'light_level'  => (int)$body['light_level'],
            'tank_level'   => (int)($body['tank_level'] ?? 0),
            'valve_status' => $body['valve'] ?? 'CLOSED',
            'farm_status'  => $body['status'] ?? 'Unknown',
        ]);

        // Check if irrigation should be skipped (weather integration)
        $skipIrrigation = self::checkWeatherForIrrigation($payload['user_id']);

        Response::success([
            'reading'          => $reading,
            'skip_irrigation'  => $skipIrrigation,
            'skip_reason'      => $skipIrrigation ? 'Rain forecast tomorrow' : null,
        ], 'Reading saved');
    }

    /**
     * Check weather forecast — should we skip irrigation?
     * Returns true if rain expected in next 24 hours
     */
    private static function checkWeatherForIrrigation(int $userId): bool {
        require_once __DIR__ . '/../models/User.php';
        require_once __DIR__ . '/../services/WeatherAPIService.php';

        $user     = User::find($userId);
        $county   = $user['county'] ?? 'Nairobi';
        $forecast = WeatherAPIService::getForecast($county, 2);

        // Check if any of next 2 days has rain
        foreach ($forecast as $day) {
            $condition = strtolower($day['condition'] ?? '');
            $rain      = $day['rain'] ?? 0;
            if (str_contains($condition, 'rain') || $rain > 2.0) {
                return true; // Skip irrigation — rain coming
            }
        }
        return false;
    }
}