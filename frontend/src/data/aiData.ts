import type { AIProvider, AIContext, ChatResponse, ProviderInfo } from "@/services/aiService";

// ── Mock Providers ────────────────────────────────────────────────────────────

export const mockProviders: ProviderInfo[] = [
  {
    id: "auto",
    name: "AgriNexus AI Engine",
    model: "agrinexus-v2-smart",
    available: true,
    description: "AgriNexus Intelligent AI engine for weather, crop, and market advisories",
    color: "#10B981",
  },
];


// ── Mock Chat Responses ───────────────────────────────────────────────────────

const chatResponses: Record<AIContext, string[]> = {
  market: [
    `📈 **Market Analysis for Your Region**

Based on current trends, here's what I'm seeing:

- **Tomato prices** are trending upward (+12% this month) due to reduced supply from Meru county. If you have stock, this is a good time to sell.
- **Avocado demand** from Nairobi supermarkets remains strong at 94% demand index. Buyers in Westlands and Karen are paying premium prices of KES 180-220/kg.
- **Maize prices** are expected to drop ~20% when the Western Kenya harvest comes in mid-July.

**Recommendation:** Focus your sales on avocados and tomatoes this week. Consider holding maize if you have adequate storage.`,
    `🌾 **Weekly Market Intelligence**

Here are the key opportunities I've identified:

1. **Best selling opportunity:** Avocados — demand is at a seasonal peak. Target Nairobi's Westlands and Karen markets for premium pricing (KES 200+/kg).
2. **Price alert:** French beans export prices are up 15% due to EU demand. If you're near Jomo Kenyatta Airport, consider export-grade packaging.
3. **Caution:** Potato prices in Nyandarua are softening as new harvest enters the market.

**Action items:**
- List your avocado stock on AgriNexus marketplace today
- Check current buyer offers in your county dashboard
- Consider value-addition (e.g., sorting/grading) to command higher prices`,
  ],
  weather: [
    `🌤️ **Farming Weather Advisory**

Looking at current conditions for your area:

**This Week's Outlook:**
- Temperatures: 18-26°C — ideal range for most crops
- Rainfall: Light showers expected Thursday-Friday (5-8mm)
- Humidity: 60-70% — moderate, watch for fungal conditions

**Farming Actions:**
1. ✅ **Plant now:** Conditions are optimal for tomato and bean seedlings. Soil moisture is adequate.
2. ⚠️ **Harvest before Thursday:** Get leafy vegetables (kale, spinach) harvested before the rain to prevent water damage.
3. 💧 **Irrigation:** Skip watering Tuesday-Wednesday — the forecast rain will provide sufficient moisture.
4. 🐛 **Pest watch:** Current warm, humid conditions favour aphid populations. Scout your crops and apply neem-based spray if needed.

**5-Day Confidence:** High (85%) — weather pattern is stable this week.`,
    `🌧️ **Rain Season Update**

Important weather changes coming:

**Key Points:**
- Heavy rainfall (15-25mm) expected Sunday through Monday
- Clearing skies from Tuesday with temperatures rising to 25°C
- Wind speeds increasing Friday afternoon (20+ km/h)

**What This Means for Your Farm:**
1. 🚨 **Harvest alert:** Complete all harvesting of mature crops by Saturday evening
2. 🌊 **Drainage:** Check and clear drainage channels — heavy rain could cause waterlogging
3. ⏸️ **Delay spraying:** Don't apply pesticides or foliar feeds until Tuesday when rain clears
4. 🌱 **Planting window:** Wednesday-Thursday next week will be excellent for planting — soil will be well-moistened

**Tip:** The rain pause on Tuesday is your window for field activities. Plan your week around it!`,
  ],
  general: [
    `🌱 **Welcome to AgriNexus AI Assistant!**

I'm here to help you make the best decisions for your farm. Here's what I can help with:

- **Market Intelligence** — I'll tell you the best crops to sell, current prices, and where demand is highest
- **Weather-Based Farming** — I'll interpret weather forecasts and tell you exactly what to do on your farm
- **Crop Advisory** — Planting schedules, pest management, and harvest timing
- **IoT Sensor Interpretation** — If you have sensors, I'll explain what your soil moisture, temperature, and pH readings mean

Just ask me anything! For example:
- "What should I plant this week?"
- "When is the best time to sell my tomatoes?"
- "My soil moisture sensor reads 35% — should I irrigate?"

I'm powered by the latest AI technology and trained on Kenyan agricultural data. Let's grow together! 🚜`,
    `Great question! Let me help you with that.

Based on your location and the current season, here are my recommendations:

1. **Crop Health:** The current weather conditions (moderate temperatures, adequate rainfall) are favorable for most crops. Continue your regular care routine.
2. **Market Timing:** Prices for fresh produce are generally higher mid-week (Tuesday-Thursday) when restaurants and hotels restock. Plan your market trips accordingly.
3. **Platform Tip:** Make sure your product listings on AgriNexus have clear photos and accurate descriptions — listings with photos get 3x more buyer inquiries!

Is there something specific about your farm you'd like me to look into? I can analyze your weather forecast, check market prices, or help with crop planning. 😊`,
  ],
};

export function mockChatResponse(
  provider: AIProvider = "auto",
  context: AIContext = "general",
  message: string = ""
): ChatResponse {
  const pool = chatResponses[context] ?? chatResponses.general;
  const idx = Math.abs(message.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % pool.length;
  return {
    response: pool[idx],
    provider: "AgriNexus AI Engine",
    tokens_used: undefined,
    context,
    timestamp: new Date().toISOString(),
  };
}

// ── Mock Weather Prediction ───────────────────────────────────────────────────

export function mockWeatherPrediction(county: string, crop: string) {
  return {
    prediction: `🌤️ **AI Weather Prediction for ${county}**

**7-Day Farming Outlook:**
The coming week looks favourable for farming activities in ${county} county. Temperatures will range between 18-26°C with moderate humidity (55-70%).

**Key Predictions:**
- **Monday-Wednesday:** Clear skies, ideal for field preparation and planting${crop ? ` of ${crop}` : ""}
- **Thursday-Friday:** Light showers expected (5-10mm) — natural irrigation for newly planted crops
- **Weekend:** Dry and warm — perfect for harvesting mature crops

**Farming Recommendations:**
1. 🌱 Start planting early in the week to take advantage of Thursday's rainfall
2. 💧 Reduce irrigation Monday-Wednesday — rain is coming
3. 🐛 Scout for pests mid-week when humidity peaks
4. 📦 Schedule harvest for Saturday morning when conditions are driest

**Confidence Level:** 82% — based on current atmospheric patterns and historical data for ${county}.`,
    provider: "AgriNexus AI Engine",
    county,
    crop: crop || "",
    generated_at: new Date().toISOString(),
  };
}

// ── Mock Market Analysis ──────────────────────────────────────────────────────

export function mockMarketAnalysis(county: string, crop: string) {
  return {
    analysis: `📊 **AI Market Analysis for ${county}**

**Market Overview:**
The agricultural market in ${county} county is showing positive momentum this week. Demand from Nairobi-based buyers remains strong, particularly for premium produce.

${crop ? `**${crop} Specific Analysis:**
- Current average price: KES 85/kg (up 8% from last week)
- Demand index: 87% — well above average
- Best selling channels: Nairobi supermarkets and hotel suppliers
- Price forecast: Expected to remain stable for the next 2 weeks

` : ""}**Top Opportunities This Week:**
1. 🥑 **Avocados** — Premium demand from export markets (KES 200-250/kg)
2. 🍅 **Tomatoes** — Supply shortage driving prices up (+15% this month)
3. 🫘 **French Beans** — EU demand spike creating export opportunities

**Action Plan:**
- List produce on AgriNexus marketplace with competitive pricing
- Consider bulk deals with Nairobi-based buyers for better margins
- Grade and sort produce — premium quality commands 30-40% higher prices

**Market Confidence:** High — demand fundamentals are strong heading into the season.`,
    provider: "AgriNexus AI Engine",
    county,
    crop: crop || "",
    generated_at: new Date().toISOString(),
  };
}

// ── Suggested Prompts ─────────────────────────────────────────────────────────

export const suggestedPrompts: Record<AIContext, string[]> = {
  market: [
    "What's the best crop to sell this week?",
    "Analyze tomato price trends",
    "Where are buyers paying the highest prices?",
    "Should I hold or sell my maize stock?",
    "What crops have the highest demand right now?",
    "Compare avocado vs tomato profitability",
  ],
  weather: [
    "What should I plant this week based on weather?",
    "Is it safe to spray pesticides today?",
    "When should I irrigate my tomatoes?",
    "Will the rain damage my harvest?",
    "Best planting days in the next 2 weeks?",
    "Risk of frost in my area this week?",
  ],
  general: [
    "What should I plant this season?",
    "How do I improve my soil quality?",
    "My soil moisture reads 35% — should I irrigate?",
    "How can I get better prices for my produce?",
    "What pests should I watch for this month?",
    "Help me plan my farming calendar",
  ],
};
