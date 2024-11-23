<?php

namespace App\Http\Controllers;

use App\Models\House;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

// Miguel León Fernández
class AuthController extends Controller
{
    public function register(Request $request) {
        $rules = [
            'name' => 'required|unique:users',
            'email' => 'required|string|email|max:60|unique:users',
            'password' => 'required|string|min:6',
            'confirm_password' => 'required|string|min:6|same:password',
            'housePreferences' => 'nullable|array',
            'noPreference' => 'nullable|boolean',
        ];

        $messages = [
            'name.required' => 'El nombre es obligatorio.',
            'name.unique' => 'El nombre de usuario ya existe.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Debe ser un correo electrónico válido.',
            'email.max' => 'El correo electrónico no debe superar los 60 caracteres.',
            'email.unique' => 'Este correo ya está registrado.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'confirm_password.required' => 'La confirmación de la contraseña es obligatoria.',
            'confirm_password.same' => 'La confirmación debe coincidir con la contraseña.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['name', 'email', 'password', 'confirm_password']);
            $data['password'] = bcrypt($data['password']);
            $data['level'] = 1;
            $data['experience'] = 0;
            $data['url_photo'] = null;
            $houseController = new HouseController();
            $chosenHouse = $houseController->sortingHat($request);
            $house = House::where('name', $chosenHouse)->first();
            $data['id_house'] = $house->id;
            $user = User::create($data);
            $token = $user->createToken('auth_token', ['student'])->plainTextToken;
            $user->roles()->sync(Role::where('name', 'student')->first()->id);

            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado con éxito.',
                'data' => [
                    'token' => $token,
                    'name' => $user->name
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en el servidor al procesar el registro.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request) {
        $rules = [
            'email' => 'required|email',
            'password' => 'required'
        ];

        $messages = [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Debe ingresar un correo electrónico válido.',
            'password.required' => 'La contraseña es obligatoria.'
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $roles = $user->roles()->pluck('name')->toArray();
            $token = $user->createToken('auth_token', $roles)->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Usuario logueado correctamente.',
                'data' => [
                    'token' => $token,
                    'name' => $user->name,
                    'roles' => $roles
                ]
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'errors' => ['general' => ['Credenciales incorrectas. Verifica tu correo y contraseña.']]
            ], 401);
        }
    }

    public function logout() {
        $user = Auth::user();
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'You have been logged out!'
        ], 200);
    }
}
