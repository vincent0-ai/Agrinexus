<?php
require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    
    // Clear existing data (if any)
    $db->exec("TRUNCATE TABLE market_prices");
    
    $crops = [
        'Tomatoes' => ['base' => 100, 'volatility' => 15, 'demand_base' => 85],
        'Maize'    => ['base' => 50,  'volatility' => 5,  'demand_base' => 60],
        'Beans'    => ['base' => 120, 'volatility' => 10, 'demand_base' => 75],
    ];

    $stmt = $db->prepare("INSERT INTO market_prices (crop_name, price_per_kg, demand_index, county, recorded_at) VALUES (?, ?, ?, ?, ?)");
    
    // Generate data for the last 6 months
    for ($i = 5; $i >= 0; $i--) {
        // One entry per month for simplicity of the chart
        $date = date('Y-m-d H:i:s', strtotime("-$i months"));
        
        foreach ($crops as $crop => $stats) {
            // Add some random fluctuation
            $price = $stats['base'] + rand(-$stats['volatility'], $stats['volatility']);
            // Make demand fluctuate slightly
            $demand = min(100, max(10, $stats['demand_base'] + rand(-10, 10)));
            
            // Recent months (0 and 1) should have higher demand for Tomatoes to match insights
            if ($i <= 1 && $crop === 'Tomatoes') {
                $demand = rand(90, 98);
                $price += 10; // Price goes up
            }
            
            $stmt->execute([
                $crop,
                $price,
                $demand,
                'Kiambu', // Default county
                $date
            ]);
        }
    }
    
    echo "Market data seeded successfully!\n";
} catch (Exception $e) {
    echo "Error seeding data: " . $e->getMessage() . "\n";
}
