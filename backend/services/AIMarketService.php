<?php
// agrinexus-api/services/AIMarketService.php
// Computes price trends, demand index, and AI recommendations from market_prices table

require_once __DIR__ . '/../config/database.php';

class AIMarketService {
    public static function getPriceTrends(int $months = 6): array {
        $db  = getDB();
        $sql = "SELECT crop_name, price_per_kg, DATE_FORMAT(recorded_at, '%b') AS month
                FROM market_prices
                WHERE recorded_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
                ORDER BY recorded_at ASC";
        $stmt = $db->prepare($sql);
        $stmt->execute([$months]);
        return self::pivotByMonth($stmt->fetchAll());
    }

    public static function getDemandIndex(): array {
        $db  = getDB();
        $sql = "SELECT crop_name, ROUND(AVG(demand_index), 0) AS demand
                FROM market_prices
                WHERE recorded_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
                GROUP BY crop_name
                ORDER BY demand DESC
                LIMIT 10";
        return $db->query($sql)->fetchAll();
    }

    public static function getRecommendations(string $county): array {
        // In production this would call an LLM or a rules engine.
        // For now, returns deterministic tips based on top-demand crops.
        $demand = self::getDemandIndex();
        $topCrop = $demand[0]['crop_name'] ?? 'Tomatoes';
        return [
            "$topCrop prices are trending upward. Consider listing surplus stock this week.",
            "Avocado demand from Nairobi supermarkets is at a seasonal peak. Buyers in Westlands are paying premium prices.",
            "Maize prices are stabilising. Sell before the July harvest brings prices down by an estimated 20%.",
        ];
    }

    private static function pivotByMonth(array $rows): array {
        $result = [];
        foreach ($rows as $row) {
            $month = $row['month'];
            if (!isset($result[$month])) $result[$month] = ['month' => $month];
            $result[$month][strtolower($row['crop_name'])] = (float) $row['price_per_kg'];
        }
        return array_values($result);
    }
}
