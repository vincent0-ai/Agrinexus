<?php
// agrinexus-api/controllers/AuthController.php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../services/JWTService.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class AuthController {
    public static function register(): void {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $v = (new Validator($body))
            ->required('full_name')->required('email')->required('password')->required('role')
            ->email('email')->min('password', 8)
            ->in('role', ['farmer', 'buyer']);

        if ($v->fails()) Response::error(implode(', ', $v->errors()));

        if (User::findByEmail($body['email'])) {
            Response::error('Email already registered', 409);
        }

        $user  = User::create([
            'full_name'     => $body['full_name'],
            'email'         => $body['email'],
            'password_hash' => password_hash($body['password'], PASSWORD_BCRYPT),
            'role'          => $body['role'],
            'county'        => $body['county'] ?? '',
        ]);
        $token = JWTService::generate(['user_id' => $user['id'], 'role' => $user['role']]);
        Response::success(['token' => $token, 'user' => User::toPublic($user)], 'Account created');
    }

    public static function login(): void {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];

        $v = (new Validator($body))->required('email')->required('password')->email('email');
        if ($v->fails()) Response::error(implode(', ', $v->errors()));

        $user = User::findByEmail($body['email']);
        if (!$user || !password_verify($body['password'], $user['password_hash'])) {
            Response::error('Invalid email or password', 401);
        }

        $token = JWTService::generate(['user_id' => $user['id'], 'role' => $user['role']]);
        Response::success(['token' => $token, 'user' => User::toPublic($user)], 'Login successful');
    }

    public static function logout(): void {
        // JWT is stateless — client discards token. For token blacklisting add Redis/DB.
        Response::success(null, 'Logged out');
    }

    public static function me(): void {
        require_once __DIR__ . '/../middleware/AuthMiddleware.php';
        $payload = AuthMiddleware::handle();
        $user    = User::find($payload['user_id']);
        if (!$user) Response::error('User not found', 404);
        Response::success(User::toPublic($user));
    }

    public static function updateProfile(): void {
        require_once __DIR__ . '/../middleware/AuthMiddleware.php';
        $payload = AuthMiddleware::handle();
        $user    = User::find($payload['user_id']);
        if (!$user) Response::error('User not found', 404);

        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $v = (new Validator($body))->required('full_name')->required('email')->email('email');
        if ($v->fails()) Response::error(implode(', ', $v->errors()));

        // Check email uniqueness if changed
        if ($body['email'] !== $user['email']) {
            $existing = User::findByEmail($body['email']);
            if ($existing) Response::error('Email is already in use', 409);
        }

        $updatedUser = User::update($user['id'], [
            'full_name' => $body['full_name'],
            'email'     => $body['email'],
            'county'    => $body['county'] ?? $user['county']
        ]);

        Response::success(User::toPublic($updatedUser), 'Profile updated');
    }

    public static function updatePassword(): void {
        require_once __DIR__ . '/../middleware/AuthMiddleware.php';
        $payload = AuthMiddleware::handle();
        $user    = User::find($payload['user_id']);
        if (!$user) Response::error('User not found', 404);

        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $v = (new Validator($body))->required('current_password')->required('new_password')->min('new_password', 8);
        if ($v->fails()) Response::error(implode(', ', $v->errors()));

        if (!password_verify($body['current_password'], $user['password_hash'])) {
            Response::error('Incorrect current password', 401);
        }

        $hash = password_hash($body['new_password'], PASSWORD_BCRYPT);
        User::updatePassword($user['id'], $hash);

        Response::success(null, 'Password updated successfully');
    }
}
