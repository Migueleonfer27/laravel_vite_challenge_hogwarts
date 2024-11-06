<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Miguel
    public function register(Request $request) {
        $rules = [
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

        $token = $user->createToken('user_student', ['student'])->plainTextToken;
        $user->roles()->sync('student');

        return response()->json([
            'message' => 'User successfully registered',
            'data' => [
                'token' => $token,
                'name' => $user->name
            ]
        ], 201);
    }

}
