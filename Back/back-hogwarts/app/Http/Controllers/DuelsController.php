<?php

namespace App\Http\Controllers;

use App\Models\Duel;
use App\Http\Controllers\PointsController;
use App\Models\Spell;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class DuelsController extends Controller{

    public function index()
    {
        $duels = Duel::all();

        if ($duels->isEmpty()) {
            return response()->json('Not found duels', 404);
        }
        return response()->json($duels, 200);
    }

    //Sacar los duelos de un id
    public function show($id){
        $duels = Duel::find($id);

        if (!$duels) {
            return response()->json('Not found duels', 404);
        }
        return response()->json($duels, 200);
    }


    public function create (Request $request){
        $user = $request->user(); // Obtiene el usuario autenticado

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $duel = new Duel();
        $duel->user_id = $user->id;
        $duel->resultado = 0; // O cualquier valor por defecto
        $duel->save();

        return response()->json([
            'duel' => $duel,
            'success' => true,
            'message' => 'Duelo creado correctamente'
        ], 200);
    }

    public function startDuel(Request $request){
        $user = $request->user();
        $levelUser = $user->level;

        $spellUser = Spell::where('level', '<=', $levelUser)->get();
        if($spellUser->isEmpty()){
            return response()->json([
                'sucessed' => true,
                'message' => 'No hay hechizos disponibles'
            ],400);
        }
        $duel = Duel::create([
            'user_id' => $user->id,
            'resultado' => 0,
        ]);
        return response()->json([
            'duel' => $duel,
            'success' => true,
            'message' => 'Duel started',
        ],200);
    }

    public function duelSimulation(Request $request, $duelId){
        $user = $request->user();
        $levelUser = $user->level;
        $pointsUser = 0;
        $pointsMachine = 0;
        $spellsUsed = [];

        $duel = Duel::find($duelId);

        if (!$duel) {
            return response()->json([
                'success' => false,
                'message' => 'Duel not found'
            ], 404);
        }

        $selectedSpellId = $request->input('spell_id');
        $selectedSpell = Spell::find($selectedSpellId);

        if (!$selectedSpell || $selectedSpell->level > $levelUser) {
            return response()->json([
                'success' => false,
                'message' => 'El hechizo no es válido para tu nivel'
            ], 400);
        }

        while ($pointsUser < 3 && $pointsMachine < 3) {
            $spellsUser = $selectedSpell;

            $spellsMachine = $this->spellsMachine($levelUser, collect($spellsUsed));

            if (!$spellsMachine) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay hechizos válidos para la máquina'
                ], 400);
            }

            $resultado = $this->calculateSpell($spellsUser, $spellsMachine);

            $spellsUsed[] = $spellsUser->id;
            $spellsUsed[] = $spellsMachine->id;

            if ($resultado === 'user') {
                $pointsUser++;
            } elseif ($resultado === 'machine') {
                $pointsMachine++;
            }
        }

        $winner = $pointsUser > $pointsMachine ? 'user' : 'machine';
        $duel->update([
            'result' => $winner
        ]);

        if ($winner === 'user') {
            (new PointsController)->addPointsDuels($request);
        }

        return response()->json([
            'success' => true,
            'result' => $winner,
            'points_user' => $pointsUser,
            'points_machine' => $pointsMachine
        ], 200);
    }

    public function spellsMachine($levelUser, $spellsUsed){
        $spells = $spellsUsed->where('level','<=',$levelUser);
        return $spells->isEmpty() ? null : $spells->random();
    }

    public function calculateSpell($spellUser, $spellMachine)
    {
        $percentage = [
            'attack' => 0.25,
            'defense' => 0.24,
            'healing' => 0.25,
            'damage' => 0.24,
            'summon' => 0.01,
            'action' => 0.01,
        ];

        $spellForceUser = (
            $spellUser->attack * $percentage['attack'] +
            $spellUser->defense * $percentage['defense'] +
            $spellUser->healing * $percentage['healing'] +
            $spellUser->damage * $percentage['damage'] +
            $spellUser->summon * $percentage['summon'] +
            $spellUser->action * $percentage['action']
        );

        $spellForceMachine = (
            $spellMachine->attack * $percentage['attack'] +
            $spellMachine->defense * $percentage['defense'] +
            $spellMachine->healing * $percentage['healing'] +
            $spellMachine->damage * $percentage['damage'] +
            $spellMachine->summon * $percentage['summon'] +
            $spellMachine->action * $percentage['action']
        );

        return $spellForceUser > $spellForceMachine ? 'user' : ($spellForceUser < $spellForceMachine ? 'machine' : 'draw');
    }

}
