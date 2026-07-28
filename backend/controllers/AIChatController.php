<?php
// backend/controllers/AIChatController.php
// Handles AI chat, weather prediction, and market analysis endpoints

require_once __DIR__ . '/../services/AIService.php';
require_once __DIR__ . '/../services/WeatherAPIService.php';
require_once __DIR__ . '/../services/AIMarketService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Response.php';

class AIChatController {

    /**
     * POST /ai/chat
     * Body: { provider, context, message, history: [{role, content}] }
     */
    public static function chat(): void {
        $payload = AuthMiddleware::handle();
        $user    = User::find($payload['user_id']);
        $body    = json_decode(file_get_contents('php://input'), true);

        $provider = $body['provider'] ?? 'auto';
        $context  = $body['context']  ?? 'general';
        $message  = trim($body['message'] ?? '');
        $history  = $body['history']  ?? [];

        if (empty($message)) {
            Response::error('Message is required', 400);
            return;
        }

        // Validate context
        if (!in_array($context, ['market', 'weather', 'general'])) {
            Response::error('Invalid context. Use "market", "weather", or "general"', 400);
            return;
        }

        // Build extra context from real-time data
        $extraContext = self::buildExtraContext($context, $user);

        $result = AIService::chat($provider, $context, $message, $history, $extraContext);

        Response::success([
            'response'    => $result['response'],
            'provider'    => $result['provider'],
            'tokens_used' => $result['tokens_used'] ?? null,
            'context'     => $context,
            'timestamp'   => date('c'),
        ]);
    }

    /**
     * GET /ai/providers
     */
    public static function providers(): void {
        AuthMiddleware::handle();
        Response::success(AIService::getProviders());
    }

    /**
     * POST /ai/predict-weather
     * Body: { county?, crop? }
     */
    public static function predictWeather(): void {
        $payload = AuthMiddleware::handle();
        $user    = User::find($payload['user_id']);
        $body    = json_decode(file_get_contents('php://input'), true);

        $county = $body['county'] ?? ($user['county'] ?? 'Kiambu');
        $crop   = $body['crop']   ?? '';

        // Get current weather data for context
        $weatherData = [
            'current'  => WeatherAPIService::getCurrentWeather($county),
            'forecast' => WeatherAPIService::getForecast($county, 5),
            'hourly'   => WeatherAPIService::getHourly($county),
        ];

        $result = AIService::predictWeather($county, $crop, $weatherData);

        Response::success($result);
    }

    /**
     * POST /ai/analyze-market
     * Body: { crop?, county? }
     */
    public static function analyzeMarket(): void {
        $payload = AuthMiddleware::handle();
        $user    = User::find($payload['user_id']);
        $body    = json_decode(file_get_contents('php://input'), true);

        $county = $body['county'] ?? ($user['county'] ?? 'Kiambu');
        $crop   = $body['crop']   ?? '';

        // Get current market data for context
        $marketData = [
            'price_trends' => AIMarketService::getPriceTrends(3),
            'demand_index' => AIMarketService::getDemandIndex(),
        ];

        $result = AIService::analyzeMarket($county, $crop, $marketData);

        Response::success($result);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    /**
     * Build real-time context string to inject into AI prompts.
     */
    private static function buildExtraContext(string $context, ?array $user): string {
        $county = $user['county'] ?? 'Kiambu';
        $lines  = ["User's County: $county"];

        if ($user) {
            $lines[] = "User's Name: " . ($user['full_name'] ?? 'Farmer');
            $lines[] = "User's Role: " . ($user['role'] ?? 'farmer');
        }

        try {
            if (in_array($context, ['weather', 'general'])) {
                $weather = WeatherAPIService::getCurrentWeather($county);
                $lines[] = "Current Weather: {$weather['temp']}°C, {$weather['condition']}, Wind: {$weather['wind']}, Humidity: {$weather['humidity']}";
            }

            if (in_array($context, ['market', 'general'])) {
                $demand = AIMarketService::getDemandIndex();
                if (!empty($demand)) {
                    $topCrops = array_slice(array_map(fn($d) => $d['crop_name'] . ': ' . $d['demand'] . '%', $demand), 0, 5);
                    $lines[] = "Top Demand Crops: " . implode(', ', $topCrops);
                }
            }
        } catch (\Exception $e) {
            // Don't fail if context enrichment fails
            error_log("AI context enrichment failed: " . $e->getMessage());
        }

        $lines[] = "Current Date: " . date('l, F j, Y');
        $lines[] = "Current Time: " . date('H:i') . " EAT";

        return implode("\n", $lines);
    }
}
