<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    //Cynthia
    public function sendEmail(Request $request){

        $password = $this->generatePassword(6);

        $datos = [
            'nombreUsuario' => 'Cynthia',
            'email' => 'cynthiarivasmoral@gmail.com',
            'password' => $request->$password
        ];

        $email = 'cynthiarivasmoral@gmail.com';
        $nombre = $request->name;

        //Le mando la vista 'welcome' como cuerpo del correo.
        Mail::send('vista_correo', $datos, function($message) use ($password, $email)
        {
            $message->to($email)->subject('Cambio contraseña');
            $message->from('cmagiayhechiceria@gmail.com', 'Esta es tu nueva contraseña:');
        });

        return response()->json(["enviado" => true, "mensaje"=>"Enviado"],200);
    }

    //Cynthia
    function generatePassword($length = 6) {
        // Make sure the length is not greater than 6
        $length = min($length, 6);

        // Generate a password with only numbers
        $password = '';
        for ($i = 0; $i < $length; $i++) {
            $password .= rand(0, 9); // Generate a random number between 0 and 9
        }

        return $password;
    }

}
