<?php
// backend/config/env.php

define('JWT_SECRET', 'super_secret_key_123');
define('JWT_EXPIRES_IN', 86400); // 1 day

// Weather API: Open-Meteo API is integrated (No API key required)

// AI Provider API Keys (leave empty to use mock responses)
define('GEMINI_API_KEY', '');
define('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta');
define('DEEPSEEK_API_KEY', 'your_deepseek_api_key_here');
define('DEEPSEEK_BASE_URL', 'https://api.deepseek.com/v1');
