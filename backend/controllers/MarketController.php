<?php
// agrinexus-api/controllers/MarketController.php

require_once __DIR__ . '/../services/AIMarketService.php';
require_once __DIR__ . '/../utils/Response.php';

class MarketController {
    public static function priceTrends(): void {
        $months = min(12, max(1, (int)($_GET['months'] ?? 6)));
        Response::success(AIMarketService::getPriceTrends($months));
    }

    public static function demandIndex(): void {
        Response::success(AIMarketService::getDemandIndex());
    }

    public static function aiInsights(): void {
        Response::success([
            ['label' => 'Best Crop to Sell',     'value' => 'Avocados',      'sub' => 'Demand: 94% · Price rising',      'icon' => 'TrendingUp'],
            ['label' => 'Predicted Price Trend',  'value' => '+15% Tomatoes', 'sub' => 'Expected within 2 weeks',         'icon' => 'BarChart2' ],
            ['label' => 'Demand Hotspot',         'value' => 'Nairobi CBD',   'sub' => 'Highest buyer concentration',     'icon' => 'MapPin'    ],
        ]);
    }

    public static function aiRecommendations(): void {
        $county = $_GET['county'] ?? 'Kiambu';
        Response::success(AIMarketService::getRecommendations($county));
    }
}
