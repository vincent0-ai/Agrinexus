<?php
// agrinexus-api/config/env.php
// Application-level constants

define('JWT_SECRET',       'CHANGE_THIS_TO_A_RANDOM_SECRET_STRING');
define('JWT_EXPIRES_IN',   86400);   // 24 hours in seconds
define('APP_ENV',          'development'); // 'production' in prod


define('WEATHER_API_KEY',  'f08d7bbc710a60523ef82873bcddd4cc');     // OpenWeatherMap API key
define('WEATHER_BASE_URL', 'https://api.openweathermap.org/data/2.5');