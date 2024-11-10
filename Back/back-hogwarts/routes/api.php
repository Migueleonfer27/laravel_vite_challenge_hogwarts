<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmailController;


//Monica
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'index'])->middleware('abilities:Dumbledore');
    Route::get('/user/{id}', [AdminController::class, 'show'])->middleware('abilities:Dumbledore');
    Route::post('/user', [AdminController::class, 'create'])->middleware('abilities:Dumbledore');
    Route::put('/user/{id}', [AdminController::class, 'update'])->middleware('abilities:Dumbledore');
    Route::delete('/user/{id}', [AdminController::class, 'destroy'])->middleware('abilities:Dumbledore');
    Route::get('role', [AdminController::class, 'getRole'])->middleware('abilities:Dumbledore');
    Route::post('/user-rol/{id}', [AdminController::class, 'giveRole'])->middleware('abilities:Dumbledore');
    Route::delete('/user-rol/{id}', [AdminController::class, 'retireRole'])->middleware('abilities:Dumbledore');
});

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');

Route::get('/nologin', function () {
    return response()->json(['message' => 'Unauthorized'], 401);
});

Route::put('changePassword', [EmailController::class, 'changePassword']);
