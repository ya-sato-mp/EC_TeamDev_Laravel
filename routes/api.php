<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController as ApiProductController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\AuthController;

Route::middleware('auth:sanctum')->group(function () {


Route::apiResource('products', ApiProductController::class);
Route::apiResource('cart-items', CartItemController::class);
Route::apiResource('orders', OrderController::class);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::apiResource('admin/products', AdminProductController::class);
