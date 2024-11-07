<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

//Monica
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'index'])->middleware('admin');
    Route::get('/user/{id}', [AdminController::class, 'show'])->middleware('admin');
    Route::post('/user/{id}', [AdminController::class, 'update'])->middleware('admin');
    Route::delete('/user/{id}', [AdminController::class, 'destroy'])->middleware('admin');
    Route::post('/user-rol/{id}', [AdminController::class, 'giveRole'])->middleware('admin');
    Route::delete('/user-rol/{id}', [AdminController::class, 'retireRole'])->middleware('admin');
});
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
