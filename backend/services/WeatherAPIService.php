<?php
require_once __DIR__ . '/../config/env.php';
require_once __DIR__ . '/../config/database.php';

class WeatherAPIService {
    private const CACHE_MINUTES = 30;

    public static function getCurrentWeather(string $county): array {
        $cached = self::getCache($county, 'current');
        if ($cached) return $cached;

        if (empty(WEATHER_API_KEY)) return self::mockCurrentWeather($county);

        $url  = WEATHER_BASE_URL . "/weather?q=" . urlencode($county) . ",KE&units=metric&appid=" . WEATHER_API_KEY;
        $raw  = self::fetch($url);

        if (isset($raw['cod']) && $raw['cod'] !== 200) {
            return self::mockCurrentWeather($county);
        }

        $data = [
            'temp'       => (int)round($raw['main']['temp']),
            'feels_like' => (int)round($raw['main']['feels_like']),
            'condition'  => ucfirst($raw['weather'][0]['description']),
            'icon'       => $raw['weather'][0]['icon'],
            'location'   => $raw['name'] . ', Kenya',
            'wind'       => round($raw['wind']['speed'] * 3.6) . ' km/h',
            'humidity'   => $raw['main']['humidity'] . '%',
            'uvIndex'    => '4 Moderate',
            'visibility' => isset($raw['visibility']) ? round($raw['visibility'] / 1000) . ' km' : '10 km',
            'updatedAt'  => date('H:i'),
            'sunrise'    => date('H:i', $raw['sys']['sunrise']),
            'sunset'     => date('H:i', $raw['sys']['sunset']),
        ];

        self::setCache($county, 'current', $data);
        return $data;
    }

    public static function getForecast(string $county, int $days = 7): array {
        $cached = self::getCache($county, "forecast_$days");
        if ($cached) return $cached;

        if (empty(WEATHER_API_KEY)) return self::mockForecast();

        // Use 5-day/3-hour forecast endpoint (free tier)
        $url  = WEATHER_BASE_URL . "/forecast?q=" . urlencode($county) . ",KE&units=metric&appid=" . WEATHER_API_KEY;
        $raw  = self::fetch($url);

        if (!isset($raw['list'])) return self::mockForecast();

        // Group by day and extract high/low/condition
        $days_map = [];
        foreach ($raw['list'] as $entry) {
            $day = date('D', $entry['dt']);
            if (!isset($days_map[$day])) {
                $days_map[$day] = [
                    'day'       => $day,
                    'high'      => $entry['main']['temp_max'],
                    'low'       => $entry['main']['temp_min'],
                    'condition' => ucfirst($entry['weather'][0]['description']),
                    'icon'      => $entry['weather'][0]['icon'],
                    'rain'      => $entry['rain']['3h'] ?? 0,
                ];
            } else {
                if ($entry['main']['temp_max'] > $days_map[$day]['high'])
                    $days_map[$day]['high'] = $entry['main']['temp_max'];
                if ($entry['main']['temp_min'] < $days_map[$day]['low'])
                    $days_map[$day]['low'] = $entry['main']['temp_min'];
                $days_map[$day]['rain'] += $entry['rain']['3h'] ?? 0;
            }
        }

        $data = array_values(array_map(function($d) {
            return [
                'day'       => $d['day'],
                'high'      => (int)round($d['high']),
                'low'       => (int)round($d['low']),
                'condition' => $d['condition'],
                'icon'      => $d['icon'],
                'rain'      => round($d['rain'], 1),
            ];
        }, $days_map));

        $data = array_slice($data, 0, 7);
        self::setCache($county, "forecast_$days", $data);
        return $data;
    }

    public static function getHourly(string $county): array {
        $cached = self::getCache($county, 'hourly');
        if ($cached) return $cached;

        if (empty(WEATHER_API_KEY)) return self::mockHourly();

        $url = WEATHER_BASE_URL . "/forecast?q=" . urlencode($county) . ",KE&units=metric&cnt=8&appid=" . WEATHER_API_KEY;
        $raw = self::fetch($url);

        if (!isset($raw['list'])) return self::mockHourly();

        $data = array_map(function($entry) {
            return [
                'hour' => date('H:i', $entry['dt']),
                'temp' => (int)round($entry['main']['temp']),
                'rain' => round($entry['rain']['3h'] ?? 0, 1),
            ];
        }, $raw['list']);

        self::setCache($county, 'hourly', $data);
        return $data;
    }

    // ── Cache helpers ──────────────────────────────────────────────────────
    private static function getCache(string $county, string $type): array|false {
        $db  = getDB();
        $sql = "SELECT data_json, fetched_at FROM weather_cache WHERE county = ? AND cache_key = ? LIMIT 1";
        $stmt = $db->prepare($sql);
        $stmt->execute([$county, $type]);
        $result = $stmt->fetch();
        if (!$result) return false;
        $age = (time() - strtotime($result['fetched_at'])) / 60;
        if ($age > self::CACHE_MINUTES) return false;
        return json_decode($result['data_json'], true);
    }

    private static function setCache(string $county, string $type, array $data): void {
        $db  = getDB();
        $sql = "REPLACE INTO weather_cache (county, cache_key, data_json, fetched_at) VALUES (?, ?, ?, NOW())";
        $db->prepare($sql)->execute([$county, $type, json_encode($data)]);
    }

    private static function fetch(string $url): array {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_SSL_VERIFYPEER => false,
        ]);
        $body = curl_exec($ch);
        curl_close($ch);
        return json_decode($body, true) ?? [];
    }

    // ── Mock data ──────────────────────────────────────────────────────────
    private static function mockCurrentWeather(string $county): array {
        return [
            'temp' => 23, 'feels_like' => 22,
            'condition' => 'Partly Cloudy', 'icon' => '02d',
            'location' => "$county, Kenya", 'updatedAt' => date('H:i'),
            'wind' => '12 km/h', 'humidity' => '65%',
            'uvIndex' => '4 Moderate', 'visibility' => '10 km',
            'sunrise' => '06:20', 'sunset' => '18:45',
        ];
    }

    private static function mockForecast(): array {
        return [
            ['day' => 'Thu', 'high' => 26, 'low' => 15, 'condition' => 'Sunny',         'icon' => '01d', 'rain' => 0  ],
            ['day' => 'Fri', 'high' => 24, 'low' => 14, 'condition' => 'Partly Cloudy', 'icon' => '02d', 'rain' => 0  ],
            ['day' => 'Sat', 'high' => 22, 'low' => 13, 'condition' => 'Cloudy',        'icon' => '03d', 'rain' => 0  ],
            ['day' => 'Sun', 'high' => 19, 'low' => 12, 'condition' => 'Rain',          'icon' => '10d', 'rain' => 5.2],
            ['day' => 'Mon', 'high' => 18, 'low' => 11, 'condition' => 'Rain',          'icon' => '10d', 'rain' => 3.8],
            ['day' => 'Tue', 'high' => 23, 'low' => 13, 'condition' => 'Clear',         'icon' => '01d', 'rain' => 0  ],
            ['day' => 'Wed', 'high' => 25, 'low' => 15, 'condition' => 'Sunny',         'icon' => '01d', 'rain' => 0  ],
        ];
    }

    private static function mockHourly(): array {
        return [
            ['hour' => '06:00', 'temp' => 16, 'rain' => 0  ],
            ['hour' => '08:00', 'temp' => 19, 'rain' => 0  ],
            ['hour' => '10:00', 'temp' => 22, 'rain' => 0  ],
            ['hour' => '12:00', 'temp' => 24, 'rain' => 0  ],
            ['hour' => '14:00', 'temp' => 23, 'rain' => 3.2],
            ['hour' => '16:00', 'temp' => 21, 'rain' => 1.8],
            ['hour' => '18:00', 'temp' => 19, 'rain' => 0  ],
            ['hour' => '20:00', 'temp' => 17, 'rain' => 0  ],
        ];
    }
}