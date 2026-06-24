<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;

Route::apiResource('products', ProductController::class);
Route::apiResource('cart-items', CartItemController::class);
Route::apiResource('orders', OrderController::class);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login'])->name('api.login');

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/user', fn(Request $request) => $request->user());
  Route::post('/logout', [AuthController::class, 'logout']);

  Route::apiResource('/products', ProductController::class);

  Route::apiResource('admin/products', AdminProductController::class);
});
