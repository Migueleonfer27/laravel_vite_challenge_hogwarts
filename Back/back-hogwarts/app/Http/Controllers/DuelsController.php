<?php

namespace App\Http\Controllers;

use App\Models\Duel;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class DuelsController extends Controller{

    public function index(){
        $duels = Duel::all();

        if($duels->isEmpty()){
            return response()->json('Not found subjects', 404);
        }
        return response()->json($duels, 200);
    }

    public function show($id){
        $duels = Duel::find($id);

        if(!$duels){
            return response()->json('Not found subject', 404);
        }
        return response()->json($duels, 200);
    }

    public function create (Request $request){
        $input = $request->all();

        $messages = [
            'required' => 'The :attribute field is required.'
        ];

        $validator = Validator::make($input,$messages);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $duel = new Duel();
        $duel->id = $request->input('id');
        $duel->save();

        return response()->json([
            'duel' => $duel,
            'success' => true
        ],200);
    }
}
