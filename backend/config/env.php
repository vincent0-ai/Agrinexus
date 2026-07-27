<?php
// backend/config/env.php

if (!defined('JWT_SECRET'))       define('JWT_SECRET', getenv('JWT_SECRET') ?: 'super_secret_key_123');
if (!defined('JWT_EXPIRES_IN'))   define('JWT_EXPIRES_IN', (int)(getenv('JWT_EXPIRES_IN') ?: 86400)); // 1 day

if (!defined('WEATHER_API_KEY'))  define('WEATHER_API_KEY', getenv('WEATHER_API_KEY') ?: '');
if (!defined('WEATHER_BASE_URL')) define('WEATHER_BASE_URL', getenv('WEATHER_BASE_URL') ?: 'https://api.openweathermap.org/data/2.5');

// AI Provider API Keys (leave empty to use mock responses)
if (!defined('GEMINI_API_KEY'))   define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');
if (!defined('GEMINI_BASE_URL'))  define('GEMINI_BASE_URL', getenv('GEMINI_BASE_URL') ?: 'https://generativelanguage.googleapis.com/v1beta');
if (!defined('DEEPSEEK_API_KEY')) define('DEEPSEEK_API_KEY', getenv('DEEPSEEK_API_KEY') ?: '');
if (!defined('DEEPSEEK_BASE_URL'))define('DEEPSEEK_BASE_URL', getenv('DEEPSEEK_BASE_URL') ?: 'https://api.deepseek.com/v1');
