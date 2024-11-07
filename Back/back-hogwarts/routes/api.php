<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AdminController;

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'index'])->middleware('admin');
    Route::get('/user/{id}', [AdminController::class, 'show'])->middleware('admin');
    Route::put('/user/{id}', [AdminController::class, 'update'])->middleware('admin');
    Route::delete('/user/{id}', [AdminController::class, 'destroy'])->middleware('admin');
    Route::post('/user/{id}', [AdminController::class, 'giveRole'])->middleware('admin');
    Route::delete('/user/{id}', [AdminController::class, 'retireRole'])->middleware('admin');
});
