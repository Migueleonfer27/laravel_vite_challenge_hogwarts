<?php

namespace App\Http\Controllers;

use App\Models\Duel;
use App\Models\Spell;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class DuelsController extends Controller{

    public function index()
    {
        $duels = Duel::all();

        if ($duels->isEmpty()) {
            return response()->json('Not found subjects', 404);
        }
        return response()->json($duels, 200);
    }

    //Sacar los duelos de un id
    public function show($id){
        $duels = Duel::find($id);

        if (!$duels) {
            return response()->json('Not found subject', 404);
        }
        return response()->json($duels, 200);
    }


    public function create (Request $request){
        $input = $request->all();
        $validator = Validator::make($input);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $duel = new Duel();
        $duel->save();

        return response()->json([
            'duel' => $duel,
            'success' => true
        ],200);
    }

    public function startDuel(Request $request){
        $user = $request->user();
        $levelUser = $user->level;

        $spellUser = Spell::where('level','<=',$levelUser)->where('level','>=',$levelUser);
        if($spellUser->isEmpty()){
            return response()->json([
                'sucessed' => true,
                'message' => 'No hay hechizos disponibles'
            ],400);
        }
        $duel = Duel::create([
            'user_id' => $user->id,
            'resultado' => null,
        ]);
        return response()->json([
            'duel' => $duel,
            'success' => true,
            'message' => 'Duel started',
        ],200);
    }

    public function duelSimulation(Request $request, $duelId){
        $user = Auth::user();
        $levelUser = $user->level;
        $spell = Spell::where('level','<=',$levelUser);
        $spellsUsed = [];
        $pointsUser = 0;
        $pointsMachine = 0;

        $duel = Duel::find($duelId);

        $selectedSpellId = $request->input('spell_id');
        $selectedSpell = Spell::find($selectedSpellId);

        if(!$selectedSpell || $selectedSpell->level > $levelUser){
            return response()->json([
                'sucessed' => true,
                'message' => 'El hechizo no es válido para tu nivel'
            ],400);
        }

        while($pointsUser < 3 && $pointsMachine < 3){
            $spellsUser = $selectedSpell;
            $spellsMachine = $this->selectedSpellMachine($levelUser, $spellsUsed);

            if($spellsUsed && $spellsMachine){
                $resultado = $this->calculateResult ($spellsUsed, $spellsMachine);
                $spellsUsed[] = $spellsUser->spell_id;
                $spellsUsed[] = $spellsMachine->spell_id;

                if($resultado === 'user'){
                    $pointsMachine++;
                }else if($resultado === 'machine'){
                    $pointsMachine++;
                }
            }else{
                return response()->json([
                    'sucessed' => true,
                    'message'=>'No se pueden usar hechizos no validos'
                ],400);
            }
        }

        $winner =$pointsUser > $pointsMachine ? 'user' :'machine';
        $duel->update([
            'resultado' => $winner
        ]);

        if($winner === 'user'){
            $this->PointsController::classaddPointsDuels($request);
        }
        return response()->json([
            'success' => true,
            'result' => $resultado,
        ],200);
    }


    public function spellsMachine($levelUser, $spellsUsed){
        $spells = $spellsUsed->where('level','<=',$levelUser);
        return $spells->isEmpty() ? null : $spells->random();
    }

    public function calculateSpell($spellUser, $spellMachine)
    {
        $pesos = [
            'attack' => 0.25,
            'defense' => 0.20,
            'healing' => 0.15,
            'damage' => 0.30,
            'summon' => 0.05,
            'action' => 0.05,
        ];

        $spellForceUser = (
            $spellUser->attack * $pesos['attack'] +
            $spellUser->defense * $pesos['defense'] +
            $spellUser->healing * $pesos['healing'] +
            $spellUser->damage * $pesos['damage'] +
            $spellUser->summon * $pesos['summon'] +
            $spellUser->action * $pesos['action']
        );

        $spellForceMachine = (
            $spellMachine->attack * $pesos['attack'] +
            $spellMachine->defense * $pesos['defense'] +
            $spellMachine->healing * $pesos['healing'] +
            $spellMachine->damage * $pesos['damage'] +
            $spellMachine->summon * $pesos['summon'] +
            $spellMachine->action * $pesos['action']
        );

        return $spellForceUser > $spellForceMachine ? 'usuario' : ($spellForceUser < $spellForceMachine ? 'machine' : 'empate');
    }

}
