<?php
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class ProductController {
    public static function index(): void {
        $category = $_GET['category'] ?? null;
        $county   = $_GET['county']   ?? null;
        $sort     = $_GET['sort']     ?? 'created_at';
        $page     = max(1, (int)($_GET['page'] ?? 1));
        $perPage  = 12;

        [$items, $total] = Product::all($category, $county, $sort, $page, $perPage);
        Response::paginate($items, $total, $page, $perPage);
    }

    public static function show(int $id): void {
        $product = Product::find($id);
        if (!$product) Response::error('Product not found', 404);
        Response::success($product);
    }

    public static function store(): void {
        $payload = AuthMiddleware::requireRole('farmer');

        // Handle both JSON and multipart/form-data
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($contentType, 'multipart/form-data')) {
            $body = $_POST;
        } else {
            $body = json_decode(file_get_contents('php://input'), true) ?? [];
        }

        $v = (new Validator($body))
            ->required('name')->required('category')
            ->required('price')->required('quantity')->required('unit')
            ->numeric('price')->numeric('quantity')
            ->in('category', ['Vegetables', 'Fruits', 'Grains', 'Dairy']);

        if ($v->fails()) Response::error(implode(', ', $v->errors()));

        // Handle image upload
        $imageUrl = '';
        if (!empty($_FILES['image']['tmp_name'])) {
            $file     = $_FILES['image'];
            $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowed  = ['jpg', 'jpeg', 'png', 'webp'];

            if (!in_array($ext, $allowed)) {
                Response::error('Invalid image type. Use JPG, PNG or WEBP', 422);
            }
            if ($file['size'] > 5 * 1024 * 1024) {
                Response::error('Image too large. Max 5MB', 422);
            }

            // Create uploads folder if it doesn't exist
            $uploadDir = __DIR__ . '/../uploads/products/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

            $filename = uniqid('product_') . '.' . $ext;
            move_uploaded_file($file['tmp_name'], $uploadDir . $filename);
            $imageUrl = 'http://localhost/agrinexus/uploads/products/' . $filename;
        }

        $product = Product::create([
            'farmer_id'   => $payload['user_id'],
            'name'        => $body['name'],
            'category'    => $body['category'],
            'price'       => $body['price'],
            'unit'        => $body['unit'],
            'quantity'    => $body['quantity'],
            'description' => $body['description'] ?? '',
            'image_url'   => $imageUrl,
            'status'      => 'active',
        ]);

        Response::success($product, 'Product created');
    }

    public static function update(int $id): void {
        $payload = AuthMiddleware::requireRole('farmer');
        $product = Product::find($id);
        if (!$product) Response::error('Product not found', 404);
        if ($product['farmer_id'] !== $payload['user_id']) Response::error('Forbidden', 403);

        $body    = json_decode(file_get_contents('php://input'), true) ?? [];
        $updated = Product::update($id, $body);
        Response::success($updated, 'Product updated');
    }

    public static function destroy(int $id): void {
        $payload = AuthMiddleware::requireRole('farmer');
        $product = Product::find($id);
        if (!$product) Response::error('Product not found', 404);
        if ($product['farmer_id'] !== $payload['user_id']) Response::error('Forbidden', 403);

        Product::delete($id);
        Response::success(null, 'Product deleted');
    }

    public static function mine(): void {
        $payload  = AuthMiddleware::requireRole('farmer');
        $products = Product::byFarmer($payload['user_id']);
        Response::success($products);
    }
}