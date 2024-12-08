<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class EmailController extends Controller{
//Cynthia
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
        ], [
            'required' => 'The :attribute field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized.'], 401);
        }

        // Generar una contraseña aleatoria
        $newPassword = $this->generateRandomPassword(6);

        // Actualizar la contraseña del usuario
        $user->password = bcrypt($newPassword);
        $user->save();

        // Enviar la contraseña por correo
        return $this->sendEmail($user->email, $user->name, $newPassword);
    }

    private function generateRandomPassword($length = 6){
        // Generar una contraseña aleatoria de longitud especificada
        return substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, $length);
    }

    public function sendEmail($email, $name, $password){
        $datos = [
            'nameUser' => $name,
            'email' => $email,
            'password' => $password,
        ];

        Mail::send('view_email', $datos, function ($message) use ($email) {
            $message->to($email)->subject('Cambio de contraseña');
            $message->from('cmagiayhechiceria@gmail.com', 'Nueva contraseña');
        });

        return response()->json(["send" => true, "mensaje" => "Password was changed"], 200);
    }


    public function updatePassword(Request $request) {
        $validator = Validator::make($request->all(), [
            'new_password' => 'required|string|min:6',
        ], [
            'required' => 'The :attribute field is required.',
            'min' => 'The :attribute field must be at least 6 characters.',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Obtener al usuario autenticado
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized.'], 401);
        }

        // Verificar si la nueva contraseña es igual a la actual
        if (Hash::check($request['new_password'], $user->password)) {
            return response()->json(['error' => 'La nueva contraseña es igual a la actual'], 400);
        }

        // Actualizar la contraseña
        $user->password = bcrypt($request['new_password']);
        $user->save();

        return response()->json(['success' => 'La contraseña ha sido actualizada exitosamente.'], 200);
    }


}
