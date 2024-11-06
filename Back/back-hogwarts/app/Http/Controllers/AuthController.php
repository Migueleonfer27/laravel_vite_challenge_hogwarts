<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Miguel
    public function register(Request $request) {
        $rules = [
            'name' => 'required',
            'email' => 'required|string|email|max:60|unique:users',
            'password' => 'required|string|min:6'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'email', 'password']);
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);
        $token = $user->createToken('auth_token', ['student'])->plainTextToken;
        $user->roles()->sync('student');

        return response()->json([
            'message' => 'User successfully registered',
            'data' => [
                'token' => $token,
                'name' => $user->name
            ]
        ], 201);
    }

    //Miguel
    public function login(Request $request) {
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $roles = $user->roles()->pluck('name')->toArray();
            $token = $user->createToken('auth_token', $roles)->plainTextToken;

            return response()->json([
                'message' => 'User logged',
                'data' => [
                    'token' => $token,
                    'name' => $user->name,
                    'roles' => $roles
                ]
            ], 200);
        } else {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }
    }

    //Miguel
    public function logout() {
        $user = Auth::user();
        $user->tokens()->delete();

        return response()->json([
            'message' => 'You have been logged out!'
        ], 200);
    }
}
