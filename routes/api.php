<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;

Route::apiResource('products', ProductController::class);
Route::apiResource('cart-items', CartItemController::class);
Route::apiResource('orders', OrderController::class);

Route::apiResource('admin/products', AdminProductController::class);
