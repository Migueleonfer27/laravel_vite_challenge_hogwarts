<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class EmailController extends Controller{

    public function changePassword(Request $request){

        $validator = Validator::make($request->all(),[
            'email' => 'required|string|email',
            'new_password' => 'required|string|min:6|max:6',
        ],[
            'required' => 'the :attribute field is required.',
            'min' => 'The :attribute field must be at least 6 characters.',
            'max' => 'The :attribute may not be greater than 6 characters.',
        ]);


        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $user = User::where('email', $request->email)->first();

        if(!$user){
            return response()->json(['error' => 'Unauthorized.'], 401);
        }

        if(Hash::check($request['new_password'],$user->password)){
            return response()->json('La nueva contraseña es igual a la actual',400);
        }

        $user->password = bcrypt($request['new_password']);
        $user->save();

        return $this->sendEmail($user->email,$user->name,$request->new_password);
    }

    //Cynthia
    public function sendEmail($email,$name,$password){

        $datos = [
            'nameUser' => $name,
            'email' => $email,
            'password' => $password
        ];

        //Le mando la vista 'welcome' como cuerpo del correo.
        Mail::send('view_email', $datos, function($message) use ($email) {
            $message->to($email)->subject('Cambio contraseña');
            $message->from('cmagiayhechiceria@gmail.com', 'Esta es tu nueva contraseña:');
        });

        return response()->json(["send" => true, "mensaje"=>"password was changed"],200);
    }


}
