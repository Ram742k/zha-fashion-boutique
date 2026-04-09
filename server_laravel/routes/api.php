<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomOrderController;
use App\Http\Controllers\Api\EmbroideryController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Admin Protected Routes
    Route::middleware('checkAdmin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        
        // Users Management
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/users/{user}/toggle', [UserController::class, 'toggleStatus']);

        // Other Admin routes (preserving existing ones but wrapping in checkAdmin)
        Route::apiResource('products', ProductController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::get('products/export', [ProductController::class, 'exportCsv']);
        
        Route::get('orders', [OrderController::class, 'index']);
        Route::get('orders/{order}', [OrderController::class, 'show']);
        Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::get('orders/{order}/invoice', [InvoiceController::class, 'show']);
        
        Route::get('dashboard/stats', [OrderController::class, 'dashboardStats']);
        
        Route::get('embroidery', [EmbroideryController::class, 'index']);
        Route::patch('embroidery/{order}/status', [EmbroideryController::class, 'updateStatus']);

        Route::get('custom-orders', [CustomOrderController::class, 'index']);
        Route::patch('custom-orders/{order}/quotation', [CustomOrderController::class, 'updateQuotation']);
        Route::patch('custom-orders/{order}/status', [CustomOrderController::class, 'updateStatus']);

        Route::get('settings', [SettingController::class, 'index']);
        Route::post('settings', [SettingController::class, 'update']);
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
