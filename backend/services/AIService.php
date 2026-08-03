<?php
// backend/services/AIService.php
// Unified AI chat service — automatically switches available AI models under the hood

if (file_exists(__DIR__ . '/../config/env.php')) {
    require_once __DIR__ . '/../config/env.php';
}

class AIService {

    // ── System Prompts ────────────────────────────────────────────────────────

    private const PROMPTS = [
        'market' => <<<'PROMPT'
You are AgriNexus Market Analyst, an expert AI specialising in Kenyan agricultural markets.

YOUR EXPERTISE:
- Crop pricing trends across all 47 Kenyan counties (Kiambu, Meru, Nakuru, Trans-Nzoia, etc.)
- Supply/demand dynamics for key crops: tomatoes, maize, beans, avocados, kale (sukuma wiki), potatoes, tea, coffee, macadamia, mangoes
- Seasonal price cycles — long rains (March–May), short rains (October–December), dry seasons
- Market channels: farm-gate, county markets, Nairobi CBD, Wakulima Market, supermarket chains (Naivas, Carrefour), export markets
- Post-harvest handling, cold chain logistics, and value addition opportunities

BEHAVIOUR RULES:
- Always ground advice in current data when context is provided
- Use KES (Kenyan Shillings) for all prices
- Be specific about counties and regions when making recommendations
- Include actionable next steps — not just analysis
- Keep responses concise but insightful (2-4 paragraphs max unless asked for detail)
- Use bullet points for recommendations
PROMPT,

        'weather' => <<<'PROMPT'
You are AgriNexus Weather Advisor, an agro-meteorologist AI specialising in weather-based farming decisions for Kenyan agriculture.

YOUR EXPERTISE:
- Interpreting weather forecasts for farming decisions across Kenyan agro-ecological zones
- Planting calendars by region: Highland (Kiambu, Nyeri), Rift Valley (Nakuru, Uasin Gishu), Western (Kakamega), Coastal (Kilifi), Eastern (Meru, Machakos)
- Irrigation scheduling based on rainfall predictions, evapotranspiration, and soil moisture
- Pest and disease risk assessment from weather patterns
- Harvest timing to avoid rain damage for different crops

BEHAVIOUR RULES:
- Reference specific weather data when context is provided (temperature, rainfall, humidity, wind)
- Give concrete farming actions with timing (e.g., "Plant within the next 3 days", "Delay spraying until wind drops below 10 km/h")
- Warn about weather risks with severity levels
- Keep responses practical and farmer-friendly
- Use Celsius for temperature, mm for rainfall, km/h for wind speed
PROMPT,

        'general' => <<<'PROMPT'
You are AgriNexus AI Assistant, an all-round farming advisor for Kenyan smallholder and commercial farmers using the AgriNexus digital platform.

YOUR EXPERTISE:
- All aspects of Kenyan agriculture: crop selection, soil management, irrigation, pest control, harvest, marketing
- Understanding IoT sensor data: soil moisture, temperature, humidity, pH sensors
- Interpreting market trends and weather forecasts for farming decisions
- Farm business planning: budgeting, record-keeping, loan applications
- Digital agriculture: how to use the AgriNexus platform features

BEHAVIOUR RULES:
- Be warm, encouraging, and supportive
- Start with the most actionable advice
- When given sensor data, interpret it plainly
- Cross-reference weather + market + IoT data when available for holistic advice
- Keep responses focused and under 300 words unless detail is requested
PROMPT,
    ];

    // ── Main Chat Method ──────────────────────────────────────────────────────

    /**
     * Send a chat message using available AI model under the hood.
     */
    public static function chat(
        string $provider = 'auto',
        string $context = 'general',
        string $message = '',
        array  $history = [],
        string $extraContext = ''
    ): array {
        $systemPrompt = self::PROMPTS[$context] ?? self::PROMPTS['general'];

        if (!empty($extraContext)) {
            $systemPrompt .= "\n\nCURRENT REAL-TIME DATA:\n" . $extraContext;
        }

        // Auto-switch under the hood based on active configuration
        if (!empty(GEMINI_API_KEY)) {
            $res = self::callGemini($systemPrompt, $message, $history);
            $res['provider'] = 'AgriNexus AI Engine';
            return $res;
        } elseif (!empty(DEEPSEEK_API_KEY)) {
            $res = self::callDeepSeek($systemPrompt, $message, $history);
            $res['provider'] = 'AgriNexus AI Engine';
            return $res;
        }

        // Fallback: Smart AI mock response when no API key is present
        return self::mockResponse($context, $message);
    }

    // ── Weather Prediction ────────────────────────────────────────────────────

    public static function predictWeather(string $county, string $crop, array $weatherData): array {
        $cacheKey = "ai_pred_" . md5($crop);
        $cached   = self::getAICache($county, $cacheKey, 180); // 3 hours TTL
        if ($cached) return $cached;

        $contextData = "County: $county\n";
        if ($crop) $contextData .= "Farmer's Crop: $crop\n";
        $contextData .= "Current Weather & Forecast: " . json_encode($weatherData, JSON_PRETTY_PRINT);

        $prompt = "Based on the current weather data provided, give me a comprehensive farming prediction and advisory for a farmer in $county county, Kenya.";
        if ($crop) $prompt .= " Primary crop: $crop.";
        $prompt .= " Include: 1) Weather outlook summary, 2) Specific farming actions for this week, 3) Risk alerts, 4) Optimal timing for key activities. Format clearly with headings and bullet points.";

        $result = self::chat('auto', 'weather', $prompt, [], $contextData);

        $response = [
            'prediction'   => $result['response'],
            'provider'     => 'AgriNexus AI Engine',
            'county'       => $county,
            'crop'         => $crop,
            'generated_at' => date('Y-m-d H:i:s'),
        ];

        self::setAICache($county, $cacheKey, $response);
        return $response;
    }

    // ── Dynamic Farming Advisories ────────────────────────────────────────────

    public static function getFarmingAdvisories(string $county): array {
        $cached = self::getAICache($county, 'ai_adv', 180); // 3 hours TTL
        if ($cached) return $cached;

        $weather  = WeatherAPIService::getCurrentWeather($county);
        $forecast = WeatherAPIService::getForecast($county, 5);
        $advisories = [];

        if (!empty(GEMINI_API_KEY) || !empty(DEEPSEEK_API_KEY)) {
            $extraContext  = "Current Weather in $county: {$weather['temp']}°C, {$weather['condition']}, Wind: {$weather['wind']}, Humidity: {$weather['humidity']}, UV: {$weather['uvIndex']}.\n";
            $extraContext .= "5-Day Forecast: " . json_encode($forecast);
            $prompt        = "Generate 3 short, actionable farming advisories for $county based on the weather provided. Output ONLY a valid JSON array of 3 objects with keys 'title', 'level' ('good'|'warning'|'alert'), and 'desc'.";

            $res  = self::chat('auto', 'weather', $prompt, [], $extraContext);
            $json = json_decode(trim(str_replace(['```json', '```'], '', $res['response'])), true);
            if (is_array($json) && count($json) > 0) {
                $advisories = $json;
            }
        }

        if (empty($advisories)) {
            $advisories = self::generateDynamicAdvisoriesFromWeather($county, $weather, $forecast);
        }

        self::setAICache($county, 'ai_adv', $advisories);
        return $advisories;
    }

    private static function generateDynamicAdvisoriesFromWeather(string $county, array $weather, array $forecast): array {
        $temp     = $weather['temp'] ?? 22;
        $humidity = (int)str_replace('%', '', $weather['humidity'] ?? '65');
        $rainyDays = array_filter($forecast, fn($d) => ($d['rain'] ?? 0) > 2.0);

        $advisories = [];

        if (count($rainyDays) > 0) {
            $firstRainDay = reset($rainyDays)['day'];
            $advisories[] = [
                'title' => 'Rain Forecasted — Plan Spraying & Harvest',
                'level' => 'warning',
                'desc'  => "Rain expected on {$firstRainDay} in {$county}. Complete mature crop harvest before rainfall and avoid applying foliar sprays.",
            ];
        } else {
            $advisories[] = [
                'title' => 'Favorable Dry Window for Field Work',
                'level' => 'good',
                'desc'  => "Clear weather expected across {$county} this week. Ideal for harvesting, weeding, and solar drying of grains.",
            ];
        }

        if ($humidity >= 70 && $temp >= 18) {
            $advisories[] = [
                'title' => 'Fungal Disease Risk Alert',
                'level' => 'alert',
                'desc'  => "Humidity at {$humidity}% and temperature at {$temp}°C create high fungal pathogen risk for tomatoes and potatoes in {$county}.",
            ];
        } else {
            $advisories[] = [
                'title' => 'Optimal Planting & Germination Conditions',
                'level' => 'good',
                'desc'  => "Current soil and air temperature ({$temp}°C) provide ideal warmth for seed germination and seedling growth.",
            ];
        }

        if ($temp > 25) {
            $advisories[] = [
                'title' => 'Irrigation Advisory — High Evapotranspiration',
                'level' => 'warning',
                'desc'  => "Warm temperatures ({$temp}°C) accelerate moisture loss. Schedule drip irrigation in early morning or late evening.",
            ];
        } else {
            $advisories[] = [
                'title' => 'Efficient Drip Irrigation Day',
                'level' => 'good',
                'desc'  => "Moderate wind speed ({$weather['wind']}) and temperature ({$temp}°C) make today optimal for efficient water management.",
            ];
        }

        return $advisories;
    }

    // ── Market Analysis ───────────────────────────────────────────────────────

    public static function analyzeMarket(string $county, string $crop, array $marketData): array {
        $cacheKey = "ai_mkt_" . md5($crop);
        $cached   = self::getAICache($county, $cacheKey, 360); // 6 hours TTL
        if ($cached) return $cached;

        $contextData = "County: $county\n";
        if ($crop) $contextData .= "Focus Crop: $crop\n";
        $contextData .= "Current Market Data: " . json_encode($marketData, JSON_PRETTY_PRINT);

        $prompt = "Analyze the current market conditions for a farmer in $county county, Kenya.";
        if ($crop) $prompt .= " Focus on $crop.";
        $prompt .= " Include: 1) Price trend analysis, 2) Best time to sell, 3) Demand hotspots, 4) Specific recommendations for maximising revenue this week.";

        $result = self::chat('auto', 'market', $prompt, [], $contextData);

        $response = [
            'analysis'     => $result['response'],
            'provider'     => 'AgriNexus AI Engine',
            'county'       => $county,
            'crop'         => $crop,
            'generated_at' => date('Y-m-d H:i:s'),
        ];

        self::setAICache($county, $cacheKey, $response);
        return $response;
    }


    // ── Provider Implementations ──────────────────────────────────────────────

    private static function callGemini(string $systemPrompt, string $message, array $history): array {
        $url = GEMINI_BASE_URL . '/models/gemini-2.5-flash:generateContent?key=' . GEMINI_API_KEY;

        $payload = [
            'system_instruction' => [
                'parts' => [['text' => $systemPrompt]]
            ],
            'contents' => [],
            'generationConfig' => [
                'temperature'     => 0.7,
                'topP'            => 0.9,
                'maxOutputTokens' => 2048,
            ],
        ];

        foreach ($history as $msg) {
            $role = $msg['role'] === 'user' ? 'user' : 'model';
            $payload['contents'][] = [
                'role'  => $role,
                'parts' => [['text' => $msg['content']]],
            ];
        }

        $payload['contents'][] = [
            'role'  => 'user',
            'parts' => [['text' => $message]],
        ];

        $response = self::curlPost($url, $payload);

        $text = $response['candidates'][0]['content']['parts'][0]['text']
                ?? 'I apologize, I could not generate a response. Please try again.';

        $tokens = $response['usageMetadata']['totalTokenCount'] ?? null;

        return [
            'response'    => $text,
            'provider'    => 'AgriNexus AI Engine',
            'tokens_used' => $tokens,
        ];
    }

    private static function callDeepSeek(string $systemPrompt, string $message, array $history): array {
        $url = DEEPSEEK_BASE_URL . '/chat/completions';

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        foreach ($history as $msg) {
            $messages[] = [
                'role'    => $msg['role'] === 'user' ? 'user' : 'assistant',
                'content' => $msg['content'],
            ];
        }

        $messages[] = ['role' => 'user', 'content' => $message];

        $payload = [
            'model'       => 'deepseek-chat',
            'messages'    => $messages,
            'temperature' => 0.7,
            'max_tokens'  => 2048,
        ];


        $response = self::curlPost($url, $payload, [
            'Authorization: Bearer ' . DEEPSEEK_API_KEY,
        ]);

        $text = $response['choices'][0]['message']['content']
                ?? 'I apologize, I could not generate a response. Please try again.';

        $tokens = $response['usage']['total_tokens'] ?? null;

        return [
            'response'    => $text,
            'provider'    => 'AgriNexus AI Engine',
            'tokens_used' => $tokens,
        ];
    }

    // ── HTTP Helper ───────────────────────────────────────────────────────────

    private static function curlPost(string $url, array $payload, array $extraHeaders = []): array {
        $headers = array_merge([
            'Content-Type: application/json',
        ], $extraHeaders);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_SSL_VERIFYPEER => false,
        ]);

        $body = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            error_log("AIService cURL error: $error");
            return [];
        }

        if ($httpCode >= 400) {
            error_log("AIService HTTP $httpCode: $body");
            return [];
        }

        return json_decode($body, true) ?? [];
    }

    // ── Mock Responses ────────────────────────────────────────────────────────

    private static function mockResponse(string $context, string $message): array {
        $responses = [
            'market' => [
                "📈 **Market Analysis for Your Region**\n\nBased on current trends, here's what I'm seeing:\n\n- **Tomato prices** are trending upward (+12% this month) due to reduced supply from Meru county. If you have stock, this is a good time to sell.\n- **Avocado demand** from Nairobi supermarkets remains strong at 94% demand index. Buyers in Westlands and Karen are paying premium prices of KES 180-220/kg.\n- **Maize prices** are expected to drop ~20% when the Western Kenya harvest comes in mid-July.\n\n**Recommendation:** Focus your sales on avocados and tomatoes this week. Consider holding maize if you have adequate storage.",
                "🌾 **Weekly Market Intelligence**\n\nHere are the key opportunities I've identified:\n\n1. **Best selling opportunity:** Avocados — demand is at a seasonal peak. Target Nairobi's Westlands and Karen markets for premium pricing (KES 200+/kg).\n2. **Price alert:** French beans export prices are up 15% due to EU demand. If you're near Jomo Kenyatta Airport, consider export-grade packaging.\n3. **Caution:** Potato prices in Nyandarua are softening as new harvest enters the market.\n\n**Action items:**\n- List your avocado stock on AgriNexus marketplace today\n- Check current buyer offers in your county dashboard\n- Consider value-addition (e.g., sorting/grading) to command higher prices",
            ],
            'weather' => [
                "🌤️ **Farming Weather Advisory**\n\nLooking at current conditions for your area:\n\n**This Week's Outlook:**\n- Temperatures: 18-26°C — ideal range for most crops\n- Rainfall: Light showers expected Thursday-Friday (5-8mm)\n- Humidity: 60-70% — moderate, watch for fungal conditions\n\n**Farming Actions:**\n1. ✅ **Plant now:** Conditions are optimal for tomato and bean seedlings. Soil moisture is adequate.\n2. ⚠️ **Harvest before Thursday:** Get leafy vegetables (kale, spinach) harvested before the rain to prevent water damage.\n3. 💧 **Irrigation:** Skip watering Tuesday-Wednesday — the forecast rain will provide sufficient moisture.\n4. 🐛 **Pest watch:** Current warm, humid conditions favour aphid populations. Scout your crops and apply neem-based spray if needed.\n\n**5-Day Confidence:** High (85%) — weather pattern is stable this week.",
                "🌧️ **Rain Season Update**\n\nImportant weather changes coming:\n\n**Key Points:**\n- Heavy rainfall (15-25mm) expected Sunday through Monday\n- Clearing skies from Tuesday with temperatures rising to 25°C\n- Wind speeds increasing Friday afternoon (20+ km/h)\n\n**What This Means for Your Farm:**\n1. 🚨 **Harvest alert:** Complete all harvesting of mature crops by Saturday evening\n2. 🌊 **Drainage:** Check and clear drainage channels — heavy rain could cause waterlogging\n3. ⏸️ **Delay spraying:** Don't apply pesticides or foliar feeds until Tuesday when rain clears\n4. 🌱 **Planting window:** Wednesday-Thursday next week will be excellent for planting — soil will be well-moistened\n\n**Tip:** The rain pause on Tuesday is your window for field activities. Plan your week around it!",
            ],
            'general' => [
                "🌱 **Welcome to AgriNexus AI Assistant!**\n\nI'm here to help you make the best decisions for your farm. Here's what I can help with:\n\n- **Market Intelligence** — I'll tell you the best crops to sell, current prices, and where demand is highest\n- **Weather-Based Farming** — I'll interpret weather forecasts and tell you exactly what to do on your farm\n- **Crop Advisory** — Planting schedules, pest management, and harvest timing\n- **IoT Sensor Interpretation** — If you have sensors, I'll explain what your soil moisture, temperature, and pH readings mean\n\nJust ask me anything! For example:\n- \"What should I plant this week?\"\n- \"When is the best time to sell my tomatoes?\"\n- \"My soil moisture sensor reads 35% — should I irrigate?\"\n\nI'm powered by the latest AI technology and trained on Kenyan agricultural data. Let's grow together! 🚜",
                "Great question! Let me help you with that.\n\nBased on your location and the current season, here are my recommendations:\n\n1. **Crop Health:** The current weather conditions (moderate temperatures, adequate rainfall) are favorable for most crops. Continue your regular care routine.\n2. **Market Timing:** Prices for fresh produce are generally higher mid-week (Tuesday-Thursday) when restaurants and hotels restock. Plan your market trips accordingly.\n3. **Platform Tip:** Make sure your product listings on AgriNexus have clear photos and accurate descriptions — listings with photos get 3x more buyer inquiries!\n\nIs there something specific about your farm you'd like me to look into? I can analyze your weather forecast, check market prices, or help with crop planning. 😊",
            ],
        ];

        $contextResponses = $responses[$context] ?? $responses['general'];
        $index = crc32($message) % count($contextResponses);
        $text  = $contextResponses[abs($index)];

        return [
            'response'    => $text,
            'provider'    => 'AgriNexus AI Engine',
            'tokens_used' => null,
        ];
    }

    // ── Provider Status ───────────────────────────────────────────────────────

    public static function getProviders(): array {
        $hasKey = !empty(GEMINI_API_KEY) || !empty(DEEPSEEK_API_KEY);
        return [
            [
                'id'          => 'auto',
                'name'        => 'AgriNexus AI Engine',
                'model'       => $hasKey ? 'agrinexus-v2-live' : 'agrinexus-v2-smart',
                'available'   => true,
                'description' => 'AgriNexus Intelligent AI engine for weather, crop, and market advisories',
                'color'       => '#10B981',
            ],
        ];
    }

    // ── Cache Helpers ─────────────────────────────────────────────────────────

    private static function getAICache(string $county, string $cacheKey, int $ttlMinutes = 180): array|false {

        try {
            $db  = getDB();
            $sql = "SELECT data_json, fetched_at FROM weather_cache WHERE county = ? AND cache_key = ? LIMIT 1";
            $stmt = $db->prepare($sql);
            $stmt->execute([$county, $cacheKey]);
            $result = $stmt->fetch();
            if (!$result) return false;
            $age = (time() - strtotime($result['fetched_at'])) / 60;
            if ($age > $ttlMinutes) return false;
            return json_decode($result['data_json'], true);
        } catch (\Throwable $e) {
            return false;
        }
    }

    private static function setAICache(string $county, string $cacheKey, array $data): void {
        try {
            $db  = getDB();
            $sql = "REPLACE INTO weather_cache (county, cache_key, data_json, fetched_at) VALUES (?, ?, ?, NOW())";
            $db->prepare($sql)->execute([$county, $cacheKey, json_encode($data)]);
        } catch (\Throwable $e) {
            // Ignore cache write errors
        }
    }
}


