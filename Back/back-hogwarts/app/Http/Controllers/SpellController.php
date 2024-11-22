<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Spell;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


//Monica
class SpellController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $spell = DB::table('spells')
            ->select('spells.id', 'spells.name', 'spells.attack', 'spells.defense', 'spells.healing', 'spells.damage', 'spells.summon', 'spells.action', 'spells.level', 'spells.validation_status', 'users.name as creator')
//            ->where('validation_status', 'approved by dumbledore')
            ->leftJoin('users', 'spells.creator', '=', 'users.id')
            ->get();

        return response()->json([
            'success' => true,
            'spell' => $spell
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $input = $request->all();
        $rules = [
            'name' => 'required|string|max:30',
            'attack' => 'integer',
            'defense' => 'integer',
            'healing' => 'integer',
            'damage' => 'integer',
            'summon' => 'integer',
            'action' => 'integer',
            'level' => 'integer|required',
            'hasCreator' => 'required'
        ];

        $messages = [
            'required' => 'The :attribute is required',
            'integer' => 'The :attribute must be an integer',
            'max' => 'The :attribute must be less than :max'
        ];

        $validator = Validator::make($input, $rules, $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $hasCreator = $request['hasCreator'];
        if ($hasCreator){
            $user = Auth::user();

            $spell = new Spell();
            $spell->name = $request['name'];
            $spell->attack = $request['attack'];
            $spell->defense = $request['defense'];
            $spell->healing = $request['healing'];
            $spell->damage = $request['damage'];
            $spell->summon = $request['summon'];
            $spell->action = $request['action'];
            $spell->creator = $user->id;
            $spell->level = $request['level'];
            $spell->validation_status = 'pending';
            $spell->save();
        }else {
            $spell = new Spell();
            $spell->name = $request['name'];
            $spell->attack = $request['attack'];
            $spell->defense = $request['defense'];
            $spell->healing = $request['healing'];
            $spell->damage = $request['damage'];
            $spell->summon = $request['summon'];
            $spell->action = $request['action'];
            $spell->creator = null;
            $spell->level = $request['level'];
            $spell->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Spell created successfully',
        ], 201);

    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $input = $request->all();
        $rules = [
            'name' => 'required|string|max:30',
            'attack' => 'integer',
            'defense' => 'integer',
            'healing' => 'integer',
            'damage' => 'integer',
            'summon' => 'integer',
            'action' => 'integer',
            'level' => 'integer'
        ];

        $messages = [
            'required' => 'The :attribute is required',
            'integer' => 'The :attribute must be an integer',
            'max' => 'The :attribute must be less than :max'
        ];

        $validator = Validator::make($input, $rules, $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $spell = Spell::find($id);

        if (!$spell){
            return response()->json([
                'success' => false,
                'message' => 'Spell not found'
            ]);
        }

        $spell->name = $request['name'];
        $spell->attack = $request['attack'];
        $spell->defense = $request['defense'];
        $spell->healing = $request['healing'];
        $spell->damage = $request['damage'];
        $spell->summon = $request['summon'];
        $spell->action = $request['action'];
        $spell->level = $request['level'];
        $spell->save();

        return response()->json([
            'success' => true,
            'message' => 'Spell updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $spell = Spell::find($id);

        if (!$spell){
            return response()->json([
                'success' => false,
                'message' => 'Spell not found'
            ]);
        }

        $spell->delete();

        return response()->json([
            'success' => true,
            'message' => 'Spell deleted successfully',
        ]);
    }




}
