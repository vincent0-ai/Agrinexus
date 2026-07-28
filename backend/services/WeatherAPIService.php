<?php
if (file_exists(__DIR__ . '/../config/env.php')) {
    require_once __DIR__ . '/../config/env.php';
}
require_once __DIR__ . '/../config/database.php';

class WeatherAPIService {
    private const CACHE_MINUTES = 30;
    private const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

    // ── All 47 Kenyan Counties Lat/Lng Coordinates ──────────────────────────
    private static array $countyCoords = [
        'baringo'        => ['lat' => 0.4667,  'lng' => 35.9667],
        'bomet'          => ['lat' => -0.7833, 'lng' => 35.3500],
        'bungoma'        => ['lat' => 0.5667,  'lng' => 34.5667],
        'busia'          => ['lat' => 0.4606,  'lng' => 34.1117],
        'elgeyo-marakwet' => ['lat' => 0.8000,  'lng' => 35.5000],
        'embu'           => ['lat' => -0.5333, 'lng' => 37.4500],
        'garissa'        => ['lat' => -0.4533, 'lng' => 39.6461],
        'homa bay'       => ['lat' => -0.5167, 'lng' => 34.4500],
        'isiolo'         => ['lat' => 0.3500,  'lng' => 37.5833],
        'kajiado'        => ['lat' => -1.8500, 'lng' => 36.7833],
        'kakamega'       => ['lat' => 0.2833,  'lng' => 34.7500],
        'kericho'        => ['lat' => -0.3667, 'lng' => 35.2833],
        'kiambu'         => ['lat' => -1.1714, 'lng' => 36.8356],
        'kilifi'         => ['lat' => -3.6333, 'lng' => 39.8500],
        'kirinyaga'      => ['lat' => -0.5000, 'lng' => 37.2833],
        'kisii'          => ['lat' => -0.6817, 'lng' => 34.7667],
        'kisumu'         => ['lat' => -0.1000, 'lng' => 34.7500],
        'kitui'          => ['lat' => -1.3667, 'lng' => 38.0167],
        'kwale'          => ['lat' => -4.1833, 'lng' => 39.4500],
        'laikipia'       => ['lat' => 0.3667,  'lng' => 36.7833],
        'lamu'           => ['lat' => -2.2717, 'lng' => 40.9020],
        'machakos'       => ['lat' => -1.5167, 'lng' => 37.2667],
        'makueni'        => ['lat' => -1.8000, 'lng' => 37.6333],
        'mandera'        => ['lat' => 3.9367,  'lng' => 41.8667],
        'marsabit'       => ['lat' => 2.3333,  'lng' => 37.9833],
        'meru'           => ['lat' => 0.0500,  'lng' => 37.6500],
        'migori'         => ['lat' => -0.9633, 'lng' => 34.4733],
        'mombasa'        => ['lat' => -4.0435, 'lng' => 39.6682],
        "murang'a"       => ['lat' => -0.7167, 'lng' => 37.1500],
        'muranga'        => ['lat' => -0.7167, 'lng' => 37.1500],
        'nairobi'        => ['lat' => -1.2864, 'lng' => 36.8172],
        'nakuru'         => ['lat' => -0.3000, 'lng' => 36.0667],
        'nandi'          => ['lat' => 0.1833,  'lng' => 35.1500],
        'narok'          => ['lat' => -1.0833, 'lng' => 35.8667],
        'nyamira'        => ['lat' => -0.5667, 'lng' => 34.9333],
        'nyandarua'      => ['lat' => -0.3333, 'lng' => 36.3667],
        'nyeri'          => ['lat' => -0.4167, 'lng' => 36.9500],
        'samburu'        => ['lat' => 1.2500,  'lng' => 36.9500],
        'siaya'          => ['lat' => 0.0607,  'lng' => 34.2881],
        'taita-taveta'   => ['lat' => -3.3167, 'lng' => 38.4833],
        'tana river'     => ['lat' => -1.5000, 'lng' => 39.5000],
        'tharaka-nithi'  => ['lat' => -0.3000, 'lng' => 37.8000],
        'trans nzoia'    => ['lat' => 1.0167,  'lng' => 35.0000],
        'turkana'        => ['lat' => 3.1167,  'lng' => 35.6000],
        'uasin gishu'    => ['lat' => 0.5167,  'lng' => 35.2833],
        'vihiga'         => ['lat' => 0.8333,  'lng' => 34.7167],
        'wajir'          => ['lat' => 1.7500,  'lng' => 40.0500],
        'west pokot'     => ['lat' => 1.5000,  'lng' => 35.1167],
    ];

    public static function getCurrentWeather(string $county): array {
        $cached = self::getCache($county, 'current');
        if ($cached) return $cached;

        $coords = self::getCoordinates($county);
        $url    = self::OPEN_METEO_BASE_URL . "?latitude={$coords['lat']}&longitude={$coords['lng']}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=sunrise,sunset,uv_index_max&timezone=Africa%2FNairobi";
        $raw    = self::fetch($url);

        if (!isset($raw['current'])) {
            return self::mockCurrentWeather($county);
        }

        $current = $raw['current'];
        $daily   = $raw['daily'] ?? [];
        $isDay   = ($current['is_day'] ?? 1) === 1;
        $mapped  = self::mapWmoCode((int)($current['weather_code'] ?? 0), $isDay);

        $sunrise = isset($daily['sunrise'][0]) ? date('H:i', strtotime($daily['sunrise'][0])) : '06:20';
        $sunset  = isset($daily['sunset'][0])  ? date('H:i', strtotime($daily['sunset'][0]))  : '18:45';
        $uvIndex = isset($daily['uv_index_max'][0]) ? self::getUvLabel((float)$daily['uv_index_max'][0]) : '4 Moderate';

        $data = [
            'temp'       => (int)round($current['temperature_2m'] ?? 23),
            'feels_like' => (int)round($current['apparent_temperature'] ?? $current['temperature_2m'] ?? 22),
            'condition'  => $mapped['condition'],
            'icon'       => $mapped['icon'],
            'location'   => ucfirst($county) . ', Kenya',
            'wind'       => round($current['wind_speed_10m'] ?? 10) . ' km/h',
            'humidity'   => round($current['relative_humidity_2m'] ?? 65) . '%',
            'uvIndex'    => $uvIndex,
            'visibility' => '10 km',
            'updatedAt'  => date('H:i'),
            'sunrise'    => $sunrise,
            'sunset'     => $sunset,
        ];

        self::setCache($county, 'current', $data);
        return $data;
    }

    public static function getForecast(string $county, int $days = 7): array {
        $cached = self::getCache($county, "forecast_$days");
        if ($cached) return $cached;

        $coords = self::getCoordinates($county);
        $url    = self::OPEN_METEO_BASE_URL . "?latitude={$coords['lat']}&longitude={$coords['lng']}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days={$days}&timezone=Africa%2FNairobi";
        $raw    = self::fetch($url);

        if (!isset($raw['daily']['time'])) {
            return self::mockForecast();
        }

        $daily = $raw['daily'];
        $data  = [];

        for ($i = 0; $i < count($daily['time']); $i++) {
            $dateStr = $daily['time'][$i];
            $wmoCode = (int)($daily['weather_code'][$i] ?? 0);
            $mapped  = self::mapWmoCode($wmoCode, true);

            $data[] = [
                'day'       => date('D', strtotime($dateStr)),
                'high'      => (int)round($daily['temperature_2m_max'][$i] ?? 24),
                'low'       => (int)round($daily['temperature_2m_min'][$i] ?? 14),
                'condition' => $mapped['condition'],
                'icon'      => $mapped['icon'],
                'rain'      => round((float)($daily['precipitation_sum'][$i] ?? 0), 1),
            ];
        }

        $data = array_slice($data, 0, $days);
        self::setCache($county, "forecast_$days", $data);
        return $data;
    }

    public static function getHourly(string $county): array {
        $cached = self::getCache($county, 'hourly');
        if ($cached) return $cached;

        $coords = self::getCoordinates($county);
        $url    = self::OPEN_METEO_BASE_URL . "?latitude={$coords['lat']}&longitude={$coords['lng']}&hourly=temperature_2m,precipitation&forecast_hours=24&timezone=Africa%2FNairobi";
        $raw    = self::fetch($url);

        if (!isset($raw['hourly']['time'])) {
            return self::mockHourly();
        }

        $hourly    = $raw['hourly'];
        $data      = [];
        $currentH  = (int)date('H');

        // Extract 8 3-hour interval steps starting from current hour
        for ($i = 0; $i < count($hourly['time']); $i++) {
            $time    = strtotime($hourly['time'][$i]);
            $hourNum = (int)date('H', $time);
            
            if ($time >= time() - 3600 && count($data) < 8 && ($i % 3 === 0)) {
                $data[] = [
                    'hour' => date('H:i', $time),
                    'temp' => (int)round($hourly['temperature_2m'][$i] ?? 20),
                    'rain' => round((float)($hourly['precipitation'][$i] ?? 0), 1),
                ];
            }
        }

        if (empty($data)) {
            $data = self::mockHourly();
        }

        self::setCache($county, 'hourly', $data);
        return $data;
    }

    // ── Helper: Map County to Lat/Lng ──────────────────────────────────────
    private static function getCoordinates(string $county): array {
        $key = strtolower(trim($county));
        if (isset(self::$countyCoords[$key])) {
            return self::$countyCoords[$key];
        }
        // Default to Nairobi coordinates if unmapped
        return ['lat' => -1.2864, 'lng' => 36.8172];
    }

    // ── Helper: WMO Weather Code Interpreter ──────────────────────────────
    private static function mapWmoCode(int $code, bool $isDay = true): array {
        $suf = $isDay ? 'd' : 'n';
        return match (true) {
            $code === 0                          => ['condition' => 'Sunny',          'icon' => "01{$suf}"],
            $code === 1                          => ['condition' => 'Mostly Clear',   'icon' => "01{$suf}"],
            $code === 2                          => ['condition' => 'Partly Cloudy',  'icon' => "02{$suf}"],
            $code === 3                          => ['condition' => 'Overcast',       'icon' => "04{$suf}"],
            in_array($code, [45, 48])            => ['condition' => 'Foggy',          'icon' => "50{$suf}"],
            in_array($code, [51, 53, 55, 56, 57])=> ['condition' => 'Light Rain',     'icon' => "09{$suf}"],
            in_array($code, [61, 63, 65, 66, 67])=> ['condition' => 'Rain',           'icon' => "10{$suf}"],
            in_array($code, [71, 73, 75, 77])    => ['condition' => 'Snow',           'icon' => "13{$suf}"],
            in_array($code, [80, 81, 82])        => ['condition' => 'Rain Showers',   'icon' => "09{$suf}"],
            in_array($code, [85, 86])            => ['condition' => 'Snow Showers',   'icon' => "13{$suf}"],
            in_array($code, [95, 96, 99])        => ['condition' => 'Thunderstorm',   'icon' => "11{$suf}"],
            default                              => ['condition' => 'Partly Cloudy',  'icon' => "02{$suf}"],
        };
    }

    private static function getUvLabel(float $uv): string {
        $val = (int)round($uv);
        if ($val <= 2)  return "$val Low";
        if ($val <= 5)  return "$val Moderate";
        if ($val <= 7)  return "$val High";
        if ($val <= 10) return "$val Very High";
        return "$val Extreme";
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
            CURLOPT_USERAGENT      => 'AgriNexus/1.0',
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
            'location' => ucfirst($county) . ", Kenya", 'updatedAt' => date('H:i'),
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