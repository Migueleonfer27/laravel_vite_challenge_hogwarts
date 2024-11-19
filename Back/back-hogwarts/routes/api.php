<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\SubjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\ControladorS3;


//Monica
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'index'])->middleware('ability:dumbledore,admin');
//    Route::get('/user/{id}', [AdminController::class, 'show'])->middleware('abilities:dumbledore');
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
Route::delete('/subjects/{subjectId}/remove-subject',[SubjectController::class, 'removeSubject']);
Route::get('/user/{id}/subjects',[SubjectController::class, 'getUserSubject']);


Route::post('addpointsteacherspell',[AuthController::class, 'addPointsTeacherSpell'])->middleware('auth:sanctum');
Route::post('addpointsstudentpotion',[AuthController::class, 'addPointsStudentPotion'])->middleware('auth:sanctum');
Route::post('addpointsstudentspell',[AuthController::class, 'addPointsStudentSpell'])->middleware('auth:sanctum');

Route::get('/user/profile',[AuthController::class, 'profile'])->middleware('auth:sanctum');

Route::post('/subirs3',[ControladorS3::class::class,'cargarImagenS3']);
