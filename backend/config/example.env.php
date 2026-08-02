<?php
// backend/config/env.php

define('JWT_SECRET', 'super_secret_key_123');
define('JWT_EXPIRES_IN', 86400); // 1 day

define('WEATHER_API_KEY', ''); // left empty to use mock
define('WEATHER_BASE_URL', 'https://api.openweathermap.org/data/2.5');

// AI Provider API Keys (leave empty to use mock responses)
define('GEMINI_API_KEY', '');
define('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta');
define('DEEPSEEK_API_KEY', 'sk-93683b8e1df04d28ba6654ea9d9fe37e');
define('DEEPSEEK_BASE_URL', 'https://api.deepseek.com/v1');
