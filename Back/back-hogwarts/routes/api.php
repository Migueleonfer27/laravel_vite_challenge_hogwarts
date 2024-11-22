<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\SubjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\SpellController;
use App\Http\Controllers\UserSpellController;


//Monica
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'index'])->middleware('ability:dumbledore,admin');
    Route::get('/user/{id}', [AdminController::class, 'show'])->middleware('ability:dumbledore,teacher,student');
    Route::post('/user', [AdminController::class, 'create'])->middleware('ability:dumbledore,admin');
    Route::put('/user/{id}', [AdminController::class, 'update'])->middleware('ability:dumbledore,admin');
    Route::delete('/user/{id}', [AdminController::class, 'destroy'])->middleware('ability:dumbledore,admin');
    Route::get('role', [AdminController::class, 'getRole'])->middleware('ability:dumbledore,admin');
    Route::post('/user-rol/{id}', [AdminController::class, 'giveRole'])->middleware('ability:dumbledore,admin');
    Route::delete('/user-rol/{id}', [AdminController::class, 'retireRole'])->middleware('ability:dumbledore,admin');
});



// Miguel León Fernández
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
Route::get('getHouse', [HouseController::class, 'index'])->middleware('auth:api');

Route::get('/nologin', function () {
    return response()->json(['message' => 'Unauthorized'], 401);
});

//Cynthia
Route::put('changePassword', [EmailController::class, 'changePassword']);


Route::get('/subjects',[SubjectController::class, 'index']);
Route::get('/subject/{id}',[SubjectController::class, 'show']);
Route::post('/subjects',[SubjectController::class, 'create']);
Route::put('/subject/{id}', [SubjectController::class, 'update']);
Route::delete('/subject/{id}', [SubjectController::class, 'destroy']);

Route::post('/subjects/{subjectId}/assign-subject',[SubjectController::class, 'assignSubject']);
Route::delete('/subjects/{subjectId}/remove-subject',[SubjectController::class, 'deleteUserSubject']);


//Monica
Route::middleware('auth:sanctum')->prefix('spell')->group(function () {
    Route::get('/', [SpellController::class, 'index'])->middleware('ability:student,teacher');
    Route::post('/', [SpellController::class, 'create'])->middleware('ability:student,teacher');
    Route::put('/{id}', [SpellController::class, 'update'])->middleware('ability:teacher');
    Route::delete('/{id}', [SpellController::class, 'destroy'])->middleware('ability:teacher');
    Route::post('/learn/{id}', [UserSpellController::class, 'store'])->middleware('ability:dumbledore,student,teacher');
});
