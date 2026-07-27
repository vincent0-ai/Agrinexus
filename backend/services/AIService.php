<?php
// backend/services/AIService.php
// Unified AI chat service — supports Google Gemini & DeepSeek with agricultural prompts

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
- Government policies, NCPB pricing, and subsidies affecting farmers

BEHAVIOUR RULES:
- Always ground advice in current data when context is provided
- Use KES (Kenyan Shillings) for all prices
- Be specific about counties and regions when making recommendations
- Include actionable next steps — not just analysis
- When uncertain, say so honestly rather than guessing
- Keep responses concise but insightful (2-4 paragraphs max unless asked for detail)
- Use bullet points for recommendations
PROMPT,

        'weather' => <<<'PROMPT'
You are AgriNexus Weather Advisor, an agro-meteorologist AI specialising in weather-based farming decisions for Kenyan agriculture.

YOUR EXPERTISE:
- Interpreting weather forecasts for farming decisions across Kenyan agro-ecological zones
- Planting calendars by region: Highland (Kiambu, Nyeri), Rift Valley (Nakuru, Uasin Gishu), Western (Kakamega), Coastal (Kilifi), Eastern (Meru, Machakos)
- Irrigation scheduling based on rainfall predictions, evapotranspiration, and soil moisture
- Pest and disease risk assessment from weather patterns (e.g., late blight in cold wet conditions, aphids in dry spells)
- Harvest timing to avoid rain damage for different crops
- Frost risk in highland areas, heat stress in lowland/coastal areas
- Understanding Kenya's bimodal rainfall pattern and ITCZ influence

BEHAVIOUR RULES:
- Reference specific weather data when context is provided (temperature, rainfall, humidity, wind)
- Give concrete farming actions with timing (e.g., "Plant within the next 3 days", "Delay spraying until wind drops below 10 km/h")
- Warn about weather risks with severity levels
- Consider the farmer's specific county and crop when giving advice
- Explain the WHY behind recommendations so farmers learn
- Keep responses practical and farmer-friendly — avoid technical jargon
- Use Celsius for temperature, mm for rainfall, km/h for wind speed
PROMPT,

        'general' => <<<'PROMPT'
You are AgriNexus AI Assistant, an all-round farming advisor for Kenyan smallholder and commercial farmers using the AgriNexus digital platform.

YOUR EXPERTISE:
- All aspects of Kenyan agriculture: crop selection, soil management, irrigation, pest control, harvest, marketing
- Understanding IoT sensor data: soil moisture, temperature, humidity, pH sensors
- Interpreting market trends and weather forecasts for farming decisions
- Farm business planning: budgeting, record-keeping, loan applications (e.g., KCB, Equity Bank agri-loans)
- Digital agriculture: how to use the AgriNexus platform features (product listing, order management, weather forecasts, market analysis)
- Kenyan agricultural regulations, certifications (KS, GlobalGAP), and export requirements
- Livestock and poultry basics when asked

BEHAVIOUR RULES:
- Be warm, encouraging, and supportive — many users are first-time digital platform users
- Start with the most actionable advice
- When given sensor data, interpret it plainly (e.g., "Your soil moisture at 28% is good for tomatoes — no irrigation needed today")
- Cross-reference weather + market + IoT data when available for holistic advice
- Suggest relevant AgriNexus platform features when appropriate
- Use simple English — many users speak English as a second language
- Include emojis sparingly for friendliness (🌱 🌤️ 📈)
- Keep responses focused and under 300 words unless the user asks for detail
PROMPT,
    ];

    // ── Main Chat Method ──────────────────────────────────────────────────────

    /**
     * Send a chat message to the specified AI provider.
     *
     * @param string $provider  "gemini" or "deepseek"
     * @param string $context   "market", "weather", or "general"
     * @param string $message   The user's message
     * @param array  $history   Previous messages [{role: "user"|"assistant", content: string}]
     * @param string $extraContext  Optional real-time data to inject (weather/market/IoT)
     * @return array {response: string, provider: string, tokens_used?: int}
     */
    public static function chat(
        string $provider,
        string $context,
        string $message,
        array  $history = [],
        string $extraContext = ''
    ): array {
        $systemPrompt = self::PROMPTS[$context] ?? self::PROMPTS['general'];

        // Inject real-time context if provided
        if (!empty($extraContext)) {
            $systemPrompt .= "\n\nCURRENT REAL-TIME DATA:\n" . $extraContext;
        }

        if ($provider === 'gemini' && !empty(GEMINI_API_KEY)) {
            return self::callGemini($systemPrompt, $message, $history);
        } elseif ($provider === 'deepseek' && !empty(DEEPSEEK_API_KEY)) {
            return self::callDeepSeek($systemPrompt, $message, $history);
        }

        // Fallback: mock response
        return self::mockResponse($context, $message, $provider);
    }

    // ── Weather Prediction ────────────────────────────────────────────────────

    /**
     * Generate AI-enhanced weather farming prediction.
     */
    public static function predictWeather(string $county, string $crop, array $weatherData): array {
        $contextData = "County: $county\n";
        if ($crop) $contextData .= "Farmer's Crop: $crop\n";
        $contextData .= "Current Weather: " . json_encode($weatherData, JSON_PRETTY_PRINT);

        $prompt = "Based on the current weather data provided, give me a comprehensive farming prediction and advisory for a farmer in $county county, Kenya.";
        if ($crop) $prompt .= " They are primarily growing $crop.";
        $prompt .= " Include: 1) Weather outlook summary, 2) Specific farming actions for this week, 3) Risk alerts, 4) Optimal timing for key activities.";

        $result = self::chat('gemini', 'weather', $prompt, [], $contextData);

        return [
            'prediction' => $result['response'],
            'provider'   => $result['provider'],
            'county'     => $county,
            'crop'       => $crop,
            'generated_at' => date('Y-m-d H:i:s'),
        ];
    }

    // ── Market Analysis ───────────────────────────────────────────────────────

    /**
     * Generate AI-enhanced market analysis.
     */
    public static function analyzeMarket(string $county, string $crop, array $marketData): array {
        $contextData = "County: $county\n";
        if ($crop) $contextData .= "Focus Crop: $crop\n";
        $contextData .= "Current Market Data: " . json_encode($marketData, JSON_PRETTY_PRINT);

        $prompt = "Analyze the current market conditions for a farmer in $county county, Kenya.";
        if ($crop) $prompt .= " Focus on $crop.";
        $prompt .= " Include: 1) Price trend analysis, 2) Best time to sell, 3) Demand hotspots, 4) Specific recommendations for maximising revenue this week.";

        $result = self::chat('deepseek', 'market', $prompt, [], $contextData);

        return [
            'analysis'     => $result['response'],
            'provider'     => $result['provider'],
            'county'       => $county,
            'crop'         => $crop,
            'generated_at' => date('Y-m-d H:i:s'),
        ];
    }

    // ── Provider Implementations ──────────────────────────────────────────────

    private static function callGemini(string $systemPrompt, string $message, array $history): array {
        $url = GEMINI_BASE_URL . '/models/gemini-2.0-flash:generateContent?key=' . GEMINI_API_KEY;

        // Build contents array with history
        $contents = [];

        // Add system instruction
        $payload = [
            'system_instruction' => [
                'parts' => [['text' => $systemPrompt]]
            ],
            'contents' => [],
            'generationConfig' => [
                'temperature'     => 0.7,
                'topP'            => 0.9,
                'maxOutputTokens' => 1024,
            ],
        ];

        // Add chat history
        foreach ($history as $msg) {
            $role = $msg['role'] === 'user' ? 'user' : 'model';
            $payload['contents'][] = [
                'role'  => $role,
                'parts' => [['text' => $msg['content']]],
            ];
        }

        // Add current message
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
            'provider'    => 'gemini',
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
            'max_tokens'  => 1024,
        ];

        $response = self::curlPost($url, $payload, [
            'Authorization: Bearer ' . DEEPSEEK_API_KEY,
        ]);

        $text = $response['choices'][0]['message']['content']
                ?? 'I apologize, I could not generate a response. Please try again.';

        $tokens = $response['usage']['total_tokens'] ?? null;

        return [
            'response'    => $text,
            'provider'    => 'deepseek',
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

    private static function mockResponse(string $context, string $message, string $provider): array {
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
        $text = $contextResponses[abs($index)];

        return [
            'response'    => $text,
            'provider'    => $provider . ' (mock)',
            'tokens_used' => null,
        ];
    }

    // ── Provider Status ───────────────────────────────────────────────────────

    public static function getProviders(): array {
        return [
            [
                'id'          => 'gemini',
                'name'        => 'Google Gemini',
                'model'       => 'gemini-2.0-flash',
                'available'   => !empty(GEMINI_API_KEY),
                'description' => 'Fast, versatile AI by Google — great for weather analysis and general farming advice',
                'color'       => '#4285F4',
            ],
            [
                'id'          => 'deepseek',
                'name'        => 'DeepSeek',
                'model'       => 'deepseek-chat',
                'available'   => !empty(DEEPSEEK_API_KEY),
                'description' => 'Advanced reasoning AI — excellent for market analysis and complex farming decisions',
                'color'       => '#7C3AED',
            ],
        ];
    }
}
