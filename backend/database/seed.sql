-- AgriNexus Seed Data
-- Matches the mock data used in the React frontend
-- Run AFTER schema.sql: mysql -u root agrinexus_db < seed.sql

USE agrinexus_db;

-- ── Users ──────────────────────────────────────────────────────────────────────
-- All passwords are: Password123!  (bcrypt hash generated with PHP)
INSERT INTO users (full_name, email, password_hash, role, county) VALUES
('Wanjiku Njoroge',  'wanjiku@agrinexus.co.ke',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer', 'Kiambu'),
('Kamau Mwangi',     'kamau@agrinexus.co.ke',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer', 'Nakuru'),
('Njoroge Karanja',  'njoroge@agrinexus.co.ke',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer', 'Meru'),
('Achieng Otieno',   'achieng@agrinexus.co.ke',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer', 'Kisumu'),
('Mutua Musyoka',    'mutua@agrinexus.co.ke',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer', 'Machakos'),
('James Omondi',     'james@agrinexus.co.ke',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer',  'Nairobi'),
('Asha Mwangi',      'asha@agrinexus.co.ke',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer',  'Nairobi'),
('Mary Njeri',       'mary@agrinexus.co.ke',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer',  'Nairobi'),
('Peter Kimani',     'peter@agrinexus.co.ke',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer',  'Mombasa'),
('Grace Aoko',       'grace@agrinexus.co.ke',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer',  'Kisumu');

-- ── Products ───────────────────────────────────────────────────────────────────
INSERT INTO products (farmer_id, name, category, price, unit, quantity, description, image_url, status) VALUES
(1, 'Organic Tomatoes',  'Vegetables', 65.00,  'kg',    500,  'Freshly harvested organic tomatoes, Kiambu highlands.',     '1546094096-0df4bcaaa337', 'active'),
(2, 'Fresh Avocados',    'Fruits',     120.00, 'kg',    300,  'Hass variety avocados, Nakuru farm. Ready for market.',      '1523049673857-eb18f1dcc2aa','active'),
(3, 'Maize (Dry)',       'Grains',     55.00,  'kg',    2000, 'Dry maize, Meru region. Good for posho or animal feed.',     '1551754655-a9b74a59ad7c', 'active'),
(4, 'Sukuma Wiki',       'Vegetables', 30.00,  'bunch', 800,  'Fresh kale (sukuma wiki), harvested daily from Kisumu.',     '1510130387799-9f7ae0034e3e','active'),
(1, 'French Beans',      'Vegetables', 85.00,  'kg',    400,  'Export-quality French beans. No pesticides.',               '1592924357228-91a4daadcfea','active'),
(5, 'Passion Fruits',    'Fruits',     95.00,  'kg',    250,  'Purple passion fruits, Machakos. Sweet and ripe.',           '1491553895911-0055eca6402d','active'),
(2, 'Fresh Milk',        'Dairy',      45.00,  'litre', 1500, 'Raw whole milk from Friesian cows, Nakuru dairy farm.',      '1550583724-b2692b85b150', 'active'),
(3, 'Potatoes (Shangi)', 'Vegetables', 35.00,  'kg',    3000, 'Shangi variety potatoes from Kiambu highlands.',             '1518977956812-cd3dbadaaf31','active');

-- ── Orders ─────────────────────────────────────────────────────────────────────
INSERT INTO orders (product_id, buyer_id, farmer_id, quantity, total_price, status, delivery_address) VALUES
(1, 7, 1, 50,  3250.00, 'delivered',  'Kenyatta Market, Nairobi'),
(5, 6, 1, 20,  1700.00, 'confirmed',  'Westlands, Nairobi'),
(2, 8, 2, 30,  3600.00, 'pending',    'Karen, Nairobi'),
(3, 9, 3, 100, 5500.00, 'cancelled',  'Mombasa CBD'),
(4, 10,4, 40,  1200.00, 'pending',    'Kisumu Town Market'),
(6, 6, 5, 15,  1425.00, 'delivered',  'Westlands, Nairobi');

-- ── Market Prices (6 months of history) ───────────────────────────────────────
INSERT INTO market_prices (crop_name, price_per_kg, demand_index, county, recorded_at) VALUES
('Tomatoes', 45.00, 70, 'Nairobi', DATE_SUB(NOW(), INTERVAL 5 MONTH)),
('Maize',    28.00, 65, 'Nairobi', DATE_SUB(NOW(), INTERVAL 5 MONTH)),
('Beans',    92.00, 80, 'Nairobi', DATE_SUB(NOW(), INTERVAL 5 MONTH)),
('Avocado',  90.00, 85, 'Nairobi', DATE_SUB(NOW(), INTERVAL 5 MONTH)),

('Tomatoes', 52.00, 72, 'Nairobi', DATE_SUB(NOW(), INTERVAL 4 MONTH)),
('Maize',    31.00, 68, 'Nairobi', DATE_SUB(NOW(), INTERVAL 4 MONTH)),
('Beans',    88.00, 82, 'Nairobi', DATE_SUB(NOW(), INTERVAL 4 MONTH)),
('Avocado',  95.00, 88, 'Nairobi', DATE_SUB(NOW(), INTERVAL 4 MONTH)),

('Tomatoes', 48.00, 75, 'Nairobi', DATE_SUB(NOW(), INTERVAL 3 MONTH)),
('Maize',    29.00, 70, 'Nairobi', DATE_SUB(NOW(), INTERVAL 3 MONTH)),
('Beans',    95.00, 85, 'Nairobi', DATE_SUB(NOW(), INTERVAL 3 MONTH)),
('Avocado',  100.00,90, 'Nairobi', DATE_SUB(NOW(), INTERVAL 3 MONTH)),

('Tomatoes', 61.00, 80, 'Nairobi', DATE_SUB(NOW(), INTERVAL 2 MONTH)),
('Maize',    33.00, 72, 'Nairobi', DATE_SUB(NOW(), INTERVAL 2 MONTH)),
('Beans',    102.00,88, 'Nairobi', DATE_SUB(NOW(), INTERVAL 2 MONTH)),
('Avocado',  105.00,92, 'Nairobi', DATE_SUB(NOW(), INTERVAL 2 MONTH)),

('Tomatoes', 58.00, 82, 'Nairobi', DATE_SUB(NOW(), INTERVAL 1 MONTH)),
('Maize',    35.00, 75, 'Nairobi', DATE_SUB(NOW(), INTERVAL 1 MONTH)),
('Beans',    98.00, 90, 'Nairobi', DATE_SUB(NOW(), INTERVAL 1 MONTH)),
('Avocado',  110.00,93, 'Nairobi', DATE_SUB(NOW(), INTERVAL 1 MONTH)),

('Tomatoes', 72.00, 85, 'Nairobi', NOW()),
('Maize',    38.00, 72, 'Nairobi', NOW()),
('Beans',    89.00, 91, 'Nairobi', NOW()),
('Avocado',  120.00,94, 'Nairobi', NOW()),
('Kale',     30.00, 68, 'Nairobi', NOW());

-- ── Sensor Readings (sample 24 hours for farm_id=1) ───────────────────────────
INSERT INTO sensor_readings (farm_id, temperature, humidity, soil_moisture, light_level, recorded_at)
SELECT
    1,
    ROUND(22 + SIN(hour/3) * 4, 1),
    ROUND(65 + COS(hour/4) * 10, 0),
    ROUND(45 + SIN(hour/5 + 1) * 8, 0),
    IF(hour >= 6 AND hour <= 18, ROUND(2000 + SIN((hour-6)/12*PI())*7000), 150),
    DATE_SUB(NOW(), INTERVAL (23 - hour) HOUR)
FROM (
    SELECT 0 AS hour UNION SELECT 1 UNION SELECT 2  UNION SELECT 3
    UNION SELECT 4   UNION SELECT 5 UNION SELECT 6  UNION SELECT 7
    UNION SELECT 8   UNION SELECT 9 UNION SELECT 10 UNION SELECT 11
    UNION SELECT 12  UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
    UNION SELECT 16  UNION SELECT 17 UNION SELECT 18 UNION SELECT 19
    UNION SELECT 20  UNION SELECT 21 UNION SELECT 22 UNION SELECT 23
) hours;
