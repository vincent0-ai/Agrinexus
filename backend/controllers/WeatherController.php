<?php
// require_once __DIR__ . '/../services/WeatherAPIService.php';
// require_once __DIR__ . '/../middleware/AuthMiddleware.php';
// require_once __DIR__ . '/../utils/Response.php';
// require_once __DIR__ . '/../models/User.php';
// class WeatherController {
//     public static function current(): void {
//         $payload = AuthMiddleware::handle();
//         $user    = \User::find($payload['user_id']);
//         $county  = $_GET['county'] ?? ($user['county'] ?? 'Nairobi');
//         $data    = WeatherAPIService::getCurrentWeather($county);
//         Response::success($data);
//     }

//     public static function forecast(): void {
//         $payload = AuthMiddleware::handle();
//         $user    = \User::find($payload['user_id']);
//         $county  = $_GET['county'] ?? ($user['county'] ?? 'Nairobi');
//         $days    = min(7, max(1, (int)($_GET['days'] ?? 7)));
//         $data    = WeatherAPIService::getForecast($county, $days);
//         Response::success($data);
//     }

//     public static function hourly(): void {
//         $payload = AuthMiddleware::handle();
//         $user    = \User::find($payload['user_id']);
//         $county  = $_GET['county'] ?? ($user['county'] ?? 'Nairobi');
//         $data    = WeatherAPIService::getHourly($county);
//         Response::success($data);
//     }

//     public static function advisories(): void {
//         AuthMiddleware::handle();
//         Response::success([
//             ['title' => 'Good Day for Irrigation',  'level' => 'good',    'desc' => 'Low wind and moderate temperatures make today ideal for drip irrigation.'],
//             ['title' => 'Rain Risk — Delay Harvest', 'level' => 'warning', 'desc' => 'Heavy rainfall expected Sunday–Monday. Harvest leafy vegetables before Saturday.'],
//             ['title' => 'Ideal Planting Conditions', 'level' => 'good',    'desc' => 'Soil temperature and moisture are optimal for tomatoes and beans this week.'],
//         ]);
//     }
// }

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../services/WeatherAPIService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';

class WeatherController {
    public static function current(): void {
        $payload = AuthMiddleware::handle();
        $user    = User::find($payload['user_id']);
        $county  = $_GET['county'] ?? ($user['county'] ?? 'Nairobi');
        $data    = WeatherAPIService::getCurrentWeather($county);
        Response::success($data);
    }

    public static function forecast(): void {
        $payload = AuthMiddleware::handle();
        $user    = User::find($payload['user_id']);
        $county  = $_GET['county'] ?? ($user['county'] ?? 'Nairobi');
        $days    = min(7, max(1, (int)($_GET['days'] ?? 7)));
        $data    = WeatherAPIService::getForecast($county, $days);
        Response::success($data);
    }

    public static function hourly(): void {
        $payload = AuthMiddleware::handle();
        $user    = User::find($payload['user_id']);
        $county  = $_GET['county'] ?? ($user['county'] ?? 'Nairobi');
        $data    = WeatherAPIService::getHourly($county);
        Response::success($data);
    }

    public static function advisories(): void {
        AuthMiddleware::handle();
        Response::success([
            ['title' => 'Good Day for Irrigation',  'level' => 'good',    'desc' => 'Low wind and moderate temperatures make today ideal for drip irrigation.'],
            ['title' => 'Rain Risk — Delay Harvest', 'level' => 'warning', 'desc' => 'Heavy rainfall expected Sunday–Monday. Harvest leafy vegetables before Saturday.'],
            ['title' => 'Ideal Planting Conditions', 'level' => 'good',    'desc' => 'Soil temperature and moisture are optimal for tomatoes and beans this week.'],
        ]);
    }
}