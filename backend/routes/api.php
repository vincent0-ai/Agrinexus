<?php
// agrinexus-api/routes/api.php
// Central route dispatcher — maps METHOD + path to Controller@method

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/OrderController.php';
require_once __DIR__ . '/../controllers/WeatherController.php';
require_once __DIR__ . '/../controllers/MarketController.php';
require_once __DIR__ . '/../controllers/IoTController.php';

function dispatch(string $method, string $path): void {
    // Strip leading /api and trailing slash
    // Strip subfolder + /api/ prefix
    $path = trim($path, '/');
    $path = preg_replace('#^agrinexus/?#', '', $path);
    $path = preg_replace('#^api/?#', '', $path);

    // Auth routes
    if ($method === 'POST'  && $path === 'auth/register')       { AuthController::register(); return; }
    if ($method === 'POST'  && $path === 'auth/login')          { AuthController::login();    return; }
    if ($method === 'POST'  && $path === 'auth/logout')         { AuthController::logout();   return; }
    if ($method === 'GET'   && $path === 'auth/me')             { AuthController::me();       return; }

    // Product routes
    if ($method === 'GET'   && $path === 'products')            { ProductController::index();  return; }
    if ($method === 'GET'   && $path === 'products/mine')       { ProductController::mine();   return; }
    if ($method === 'POST'  && $path === 'products')            { ProductController::store();  return; }
    if ($method === 'GET'   && preg_match('#^products/(\d+)$#', $path, $m)) { ProductController::show((int)$m[1]); return; }
    if ($method === 'PUT'   && preg_match('#^products/(\d+)$#', $path, $m)) { ProductController::update((int)$m[1]); return; }
    if ($method === 'DELETE'&& preg_match('#^products/(\d+)$#', $path, $m)) { ProductController::destroy((int)$m[1]); return; }

    // Order routes
    // if ($method === 'GET'   && $path === 'orders')              { OrderController::index();  return; }
    // if ($method === 'GET'   && preg_match('#^orders/(\d+)$#', $path, $m)) { OrderController::show((int)$m[1]); return; }
    // if ($method === 'PATCH' && preg_match('#^orders/(\d+)/status$#', $path, $m)) { OrderController::updateStatus((int)$m[1]); return; }
    // Order routes
if ($method === 'GET'   && $path === 'orders')    { OrderController::index();  return; }
if ($method === 'POST'  && $path === 'orders')    { OrderController::store();  return; } // ADD THIS
if ($method === 'GET'   && preg_match('#^orders/(\d+)$#', $path, $m)) { OrderController::show((int)$m[1]); return; }
if ($method === 'PATCH' && preg_match('#^orders/(\d+)/status$#', $path, $m)) { OrderController::updateStatus((int)$m[1]); return; }
    // Weather routes
    if ($method === 'GET'   && $path === 'weather/current')     { WeatherController::current();    return; }
    if ($method === 'GET'   && $path === 'weather/forecast')    { WeatherController::forecast();   return; }
    if ($method === 'GET'   && $path === 'weather/advisories')  { WeatherController::advisories(); return; }
    if ($method === 'GET'   && $path === 'weather/hourly')      { WeatherController::hourly();     return; }

    // Market routes
    if ($method === 'GET'   && $path === 'market/prices')       { MarketController::priceTrends();       return; }
    if ($method === 'GET'   && $path === 'market/demand')       { MarketController::demandIndex();       return; }
    if ($method === 'GET'   && $path === 'market/insights')     { MarketController::aiInsights();        return; }
    if ($method === 'GET'   && $path === 'market/recommendations') { MarketController::aiRecommendations(); return; }

    // IoT routes
    if ($method === 'GET'   && $path === 'iot/readings')        { IoTController::readings();       return; }
    if ($method === 'GET'   && $path === 'iot/latest')          { IoTController::latestReadings(); return; }
    if ($method === 'GET'   && $path === 'iot/alerts')          { IoTController::alerts();         return; }
    if ($method === 'POST'  && $path === 'iot/ingest')          { IoTController::ingest();         return; }

    // No match
    require_once __DIR__ . '/../utils/Response.php';
    Response::error("Route not found: $method /api/$path", 404);
}
