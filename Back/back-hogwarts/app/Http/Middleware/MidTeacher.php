<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MidTeacher
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    //Cynthia
    public function handle(Request $request, Closure $next): Response{
        $user = $request->user();
        if ($user->tokenCan('teacher')) {
            return $next($request);
        }else{
            return response()->json(['error' => 'Not an teacher user'],403);
        }
    }
}
