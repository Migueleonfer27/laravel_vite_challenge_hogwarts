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
    //Monica
    public function index()
    {
        $spell = DB::table('spells')
            ->select('spells.id', 'spells.name', 'spells.attack', 'spells.defense', 'spells.healing', 'spells.damage', 'spells.summon', 'spells.action', 'spells.level', 'spells.validation_status', 'users.name as creator')
            ->where('validation_status', 'approved by dumbledore')
            ->leftJoin('users', 'spells.creator', '=', 'users.id')
            ->get();

        return response()->json([
            'success' => true,
            'spell' => $spell
        ]);
    }
     //Monica
    public function getSpellPending()
    {
        $spell = DB::table('spells')
            ->select('spells.id', 'spells.name', 'spells.attack', 'spells.defense', 'spells.healing', 'spells.damage', 'spells.summon', 'spells.action', 'spells.level', 'spells.validation_status', 'users.name as creator')
            ->where('validation_status', 'pending')
            ->leftJoin('users', 'spells.creator', '=', 'users.id')
            ->get();

        return response()->json([
            'success' => true,
            'spell' => $spell
        ]);
    }
     //Monica
    public function getSpellsStudent(){
        $spell = DB::table('spells')
        ->select('spells.id', 'spells.name', 'spells.attack', 'spells.defense', 'spells.healing', 'spells.damage', 'spells.summon', 'spells.action', 'spells.level', 'spells.validation_status', 'users.name as creator')
        ->where('spells.validation_status', 'approved by dumbledore')
        ->where('spells.level', '<=', Auth::user()->level)
        ->leftJoin('users', 'spells.creator', '=', 'users.id')
        ->get();

        $spellsOfUser = DB::table('user_spell')
        ->select('spells.id', 'spells.name', 'spells.attack', 'spells.defense', 'spells.healing', 'spells.damage', 'spells.summon', 'spells.action', 'spells.level', 'spells.validation_status', 'users.name as creator')
        ->where('user_spell.user_id', Auth::user()->id)
        ->leftJoin('spells', 'user_spell.spell_id', '=', 'spells.id')
        ->leftJoin('users', 'spells.creator', '=', 'users.id')
        ->get();


        $spellsNotLearned = [];
        foreach ($spell as $s) {
            $found = false;
            foreach ($spellsOfUser as $su) {
                $found = $found || ($s->id == $su->id);
            }
            if (!$found) {
                array_push($spellsNotLearned, $s);
            }
        }

        return response()->json([
            'success' => true,
            'spell' => $spellsNotLearned
        ]);
    }
     //Monica
    public function getSpellsLearned(){
        $user = Auth::user();

        $spells = DB::table('user_spell')
        ->select('spells.id', 'spells.name', 'spells.attack', 'spells.defense', 'spells.healing', 'spells.damage', 'spells.summon', 'spells.action', 'spells.level', 'spells.validation_status', 'users.name as creator')
        ->where('user_spell.user_id', $user->id)
        ->leftJoin('spells', 'user_spell.spell_id', '=', 'spells.id')
        ->leftJoin('users', 'spells.creator', '=', 'users.id')
        ->get();

        return response()->json([
            'success' => true,
            'spell' => $spells
        ]);

    }
     //Monica
    public function approveSpellTeacher($id){
        $spell = Spell::find($id);

        if (!$spell){
            return response()->json([
                'success' => false,
                'message' => 'Spell not found'
            ]);
        }

        $spell->validation_status = 'approved by teacher';
        $spell->save();

        return response()->json([
            'success' => true,
            'message' => 'Spell approved successfully',
        ]);
    }
     //Monica
    public function rejectSpellTeacher($id){
        $spell = Spell::find($id);

        if (!$spell){
            return response()->json([
                'success' => false,
                'message' => 'Spell not found'
            ]);
        }

        $spell->validation_status = 'rejected by teacher';
        $spell->save();

        return response()->json([
            'success' => true,
            'message' => 'Spell rejected successfully',
        ]);
    }
     //Monica
    public function approveSpellDumbledore($id){
        $spell = Spell::find($id);

        if (!$spell){
            return response()->json([
                'success' => false,
                'message' => 'Spell not found'
            ]);
        }

        $spell->validation_status = 'approved by dumbledore';
        $spell->save();

        return response()->json([
            'success' => true,
            'message' => 'Spell approved successfully',
        ]);
    }
    //Monica
    public function rejectSpellDumbledore($id){
        $spell = Spell::find($id);

        if (!$spell){
            return response()->json([
                'success' => false,
                'message' => 'Spell not found'
            ]);
        }

        $spell->validation_status = 'rejected by dumbledore';
        $spell->save();

        return response()->json([
            'success' => true,
            'message' => 'Spell rejected successfully',
        ]);
    }
     //Monica
    public function getPendingApproveTeacher()
    {
        $spell = DB::table('spells')
            ->select('spells.id', 'spells.name', 'spells.attack', 'spells.defense', 'spells.healing', 'spells.damage', 'spells.summon', 'spells.action', 'spells.level', 'spells.validation_status', 'users.name as creator')
            ->where('validation_status', 'approved by teacher')
            ->leftJoin('users', 'spells.creator', '=', 'users.id')
            ->get();

        return response()->json([
            'success' => true,
            'spell' => $spell
        ]);

    }

     //Monica
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

           if ($user->hasRole('teacher')){
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
               $spell->validation_status = 'approved by teacher';
               $spell->save();
           }elseif($user->hasRole('dumbledore')){
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
               $spell->validation_status = 'approved by dumbledore';
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
                $spell->creator = $user->id;
                $spell->level = $request['level'];
                $spell->validation_status = 'pending';
                $spell->save();
           }
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
            $spell->validation_status = 'pending';
            $spell->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Spell created successfully',
        ], 201);

    }


     //Monica
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

     //Monica
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
