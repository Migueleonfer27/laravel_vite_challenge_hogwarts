<?php

// Importaciones de middleware y otros componentes necesarios.
use App\Http\Middleware\MidAdmin;
use App\Http\Middleware\MidDumbledore;
use App\Http\Middleware\MidStudent;
use App\Http\Middleware\MidTeacher;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;

return Application::configure(basePath: dirname(__DIR__))
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
    ->withMiddleware(function (Middleware $middleware) {

        //Cynthia
        $middleware->redirectGuestsTo('/api/nologin');
        $middleware->alias([
            'abilities' => CheckAbilities::class,
            'ability' => CheckForAnyAbility::class,
            'admin' => MidAdmin::class,
            'dumbledore' => MidDumbledore::class,
            'student' => MidStudent::class,
            'teacher' => MidTeacher::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {

    })->create();
