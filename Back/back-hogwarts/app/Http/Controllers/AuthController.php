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
            'name' => 'required',
            'email' => 'required|string|email|max:60|unique:users',
            'password' => 'required|string|min:6',
            'confirm_password' => 'required|string|min:6|same:password',
            'housePreferences' => 'nullable|array',
            'noPreference' => 'nullable|boolean',
        ];

        $messages = [
            'name.required' => 'El nombre es obligatorio.',
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
            $data['url_photo'] = null; // CAMBIAR ESTO CUANDO TENGAMOS EL SISTEMA S3 DE FOTOS
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


    public function addExperience(Request $request, $id) {
        $user = User::findOrFail($id);

        $user->experience += $request->input('experience');
        $user->updateLevelBasedExperience();
        return response()->json([
            'success' => true,
            'message' => 'Experiencia actualizada correctamente.',
            'data'=>$user
        ],200);
    }


    public function addPointsTeacherSpell(Request $request){
        $user = Auth::user();  // Usuario autenticado (Dumbledore)

        // Verificar si el usuario tiene el rol 'dumbledore'
        if (!$user || !$user->hasRole('dumbledore')) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar esta acción.'
            ], 403);
        }

        // Validar que se pase el ID del usuario que va a recibir los puntos
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $targetUser = User::find($validated['user_id']);

        // Verificar que el usuario objetivo exista
        if (!$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario al que se le van a sumar los puntos no existe.'
            ], 404);
        }

        // Ahora sumamos los puntos de experiencia y los puntos de la casa al usuario seleccionado
        $targetUser->addExperienceTeacherSpell();

        return response()->json([
            'success' => true,
            'message' => 'Se han sumado 10 puntos de experiencia y 2 puntos a la casa del usuario.',
            'user' => $targetUser
        ], 200);
    }

    public function addPointsStudentPotion(){
        $user = Auth::user();
        $user->addExperienceStudentPotion();

        return response()->json([
            'success' => true,
            'message' => 'Se han sumado 2 puntos de experiencia',
            'user' => $user
        ],200);
    }

    public function addPointsStudentSpell(){
        $user = Auth::user();
        $user->addExperienceStudentSpell();

        return response()->json([
            'success' => true,
            'message' => 'Se han sumado 2 puntos de experiencia y 1 punto a la casa',
            'user' => $user
        ],200);
    }
}
