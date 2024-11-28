<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DuelsController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\PointsController;
use App\Http\Controllers\PotionController;
use App\Http\Controllers\SubjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\SpellController;
use App\Http\Controllers\UserSpellController;
use App\Http\Controllers\ControladorS3;


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
Route::delete('/subjects/{subjectId}/remove-subject',[SubjectController::class, 'removeSubject']);
Route::get('/user/{id}/subjects',[SubjectController::class, 'getUserSubject']);

Route::post('addpointsteacherspell',[PointsController::class, 'addPointsTeacherSpell'])->middleware('auth:sanctum');
Route::post('addpointsstudentpotion',[PointsController::class, 'addPointsStudentPotion'])->middleware('auth:sanctum');
Route::post('addpointsstudentspell',[PointsController::class, 'addPointsStudentSpell'])->middleware('auth:sanctum');

Route::get('/user/profile',[PointsController::class, 'profile'])->middleware('auth:sanctum');

Route::post('/subirs3',[ControladorS3::class,'cargarImagenS3'])->middleware('auth:sanctum');
Route::put('/updateimage',[ControladorS3::class,'updateProfileImage'])->middleware('auth:sanctum');

// Miguel León Fernández
Route::middleware('auth:api')->group(function () {
    Route::get('/ingredients', [IngredientController::class, 'index']);
    Route::post('/ingredients', [IngredientController::class, 'store']);
    Route::delete('/ingredients/{id}', [IngredientController::class, 'destroy']);
});

// Miguel León Fernández
Route::middleware('auth:api')->group(function () {
    Route::get('/potions', [PotionController::class, 'index']);
    Route::post('/potions', [PotionController::class, 'store']);
    Route::get('/potions/{id}', [PotionController::class, 'show']);
    Route::put('/potions/{id}', [PotionController::class, 'update']);
    Route::delete('/potions/{id}', [PotionController::class, 'destroy']);
});

// Miguel León Fernández
Route::middleware('auth:api')->group(function () {
    Route::post('/approve/{potionId}', [PointsController::class, 'approvePotion']);
});


//Monica
Route::middleware('auth:sanctum')->prefix('spell')->group(function () {
    Route::get('/', [SpellController::class, 'index'])->middleware('ability:dumbledore,teacher');
    Route::get('/student', [SpellController::class, 'getSpellsStudent'])->middleware('ability:student');
    Route::get('/learned', [SpellController::class, 'getSpellsLearned'])->middleware('ability:student');
    Route::get('/pending', [SpellController::class, 'getSpellPending'])->middleware('ability:teacher');
    Route::get('/pending/dumbledore', [SpellController::class, 'getPendingApproveTeacher'])->middleware('ability:dumbledore');
    Route::put('/approve/{id}', [SpellController::class, 'approveSpellTeacher'])->middleware('ability:teacher');
    Route::put('/reject/{id}', [SpellController::class, 'rejectSpellTeacher'])->middleware('ability:teacher');
    Route::put('/validate/{id}', [SpellController::class, 'approveSpellDumbledore'])->middleware('ability:dumbledore');
    Route::post('/addExperience/{id}', [PointsController::class, 'spellValidatedPoints'])->middleware('ability:dumbledore');
    Route::put('/invalidate/{id}', [SpellController::class, 'rejectSpellDumbledore'])->middleware('ability:dumbledore');
    Route::post('/', [SpellController::class, 'create'])->middleware('ability:student,teacher,dumbledore');
    Route::put('/{id}', [SpellController::class, 'update'])->middleware('ability:teacher,dumbledore');
    Route::delete('/{id}', [SpellController::class, 'destroy'])->middleware('ability:teacher,dumbledore');
    Route::post('/learn/{id}', [UserSpellController::class, 'store'])->middleware('ability:dumbledore,student,teacher');
});


Route::prefix('duels')->group(function () {
    Route::get('/',[DuelsController::class, 'index']);
    Route::get('/{id}',[DuelsController::class, 'show']);
    Route::post('/create',[DuelsController::class, 'create'])->middleware('auth:sanctum');;
    Route::post('start',[DuelsController::class, 'startDuel'])->middleware('auth:sanctum');
    Route::post('simulate/{duelId}',[DuelsController::class, 'duelSimulation'])->middleware('auth:sanctum');
});
