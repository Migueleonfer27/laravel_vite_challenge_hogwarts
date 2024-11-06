<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MidStudent
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    //Cynthia
    public function handle(Request $request, Closure $next): Response{
        $user = $request->user();
        if ($user->tokenCan('student')) {
            return $next($request);
        }else{
            return response()->json(['error' => 'Not an student user'],403);
        }
    }
}
