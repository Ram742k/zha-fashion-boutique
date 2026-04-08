<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\EmbroideryController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Admin API Routes
Route::prefix('admin')->group(function () {
    // Products
    Route::get('products/export', [ProductController::class, 'exportCsv']);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
    
    // Orders
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);
    Route::get('orders/{order}/invoice', [InvoiceController::class, 'show']);
    
    // Stats
    Route::get('dashboard/stats', [OrderController::class, 'dashboardStats']);
    
    // Embroidery
    Route::get('embroidery', [\App\Http\Controllers\Api\EmbroideryController::class, 'index']);
    Route::patch('embroidery/{order}/status', [\App\Http\Controllers\Api\EmbroideryController::class, 'updateStatus']);

    // Users
    Route::get('users', [\App\Http\Controllers\Api\UserController::class, 'index']);
    Route::post('users/{user}/toggle', [\App\Http\Controllers\Api\UserController::class, 'toggleStatus']);
    Route::delete('users/{user}', [\App\Http\Controllers\Api\UserController::class, 'destroy']);

    // Custom Orders
    Route::get('custom-orders', [\App\Http\Controllers\Api\CustomOrderController::class, 'index']);
    Route::patch('custom-orders/{order}/quotation', [\App\Http\Controllers\Api\CustomOrderController::class, 'updateQuotation']);
    Route::patch('custom-orders/{order}/status', [\App\Http\Controllers\Api\CustomOrderController::class, 'updateStatus']);

    // Settings
    Route::get('settings', [SettingController::class, 'index']);
    Route::post('settings', [SettingController::class, 'update']);
});
