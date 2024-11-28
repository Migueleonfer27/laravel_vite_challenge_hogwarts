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

        $duel->lifeUser = 100;
        $duel->liveMachine = 100;
        return response()->json([
            'duel' => $duel,
            'success' => true,
            'message' => 'Duel started',
        ],200);
    }

    public function duelSimulation(Request $request, $duelId)
    {
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

        for ($i = 0; $i < 5; $i++) {
            while ($duel->lifeUser > 0 && $duel->lifeMachine > 0) {
                $spellsUser = $selectedSpell;

                $spellsMachine = $this->selectMachineSpell($levelUser, $duel->lifeUser, $duel->lifeMachine, $spellsUsed);

                if (!$spellsMachine) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No hay hechizos válidos para la máquina'
                    ], 400);
                }

                $this->applySpells($spellsUser, $spellsMachine, $duel);

                $spellsUsed[] = $spellsUser->id;
                $spellsUsed[] = $spellsMachine->id;

                if ($duel->lifeUser > $duel->lifeMachine) {
                    $pointsUser++;
                } else {
                    $pointsMachine++;
                }

                if ($duel->lifeUser == 0 || $duel->lifeMachine == 0) {
                    $winner = $duel->lifeUser > $duel->lifeMachine ? 'user' : 'machine';
                    $duel->update(['resultado' => $winner]);

                    if ($winner === 'user') {
                        (new PointsController)->addPointsDuels($request);
                    }
                    return response()->json([
                        'success' => true,
                        'resultado' => $winner,
                        'points_user' => $pointsUser,
                        'points_machine' => $pointsMachine,
                        'life_user' => $duel->lifeUser,
                        'life_machine' => $duel->lifeMachine
                    ], 200);
                }
            }

            $winner = $pointsUser > $pointsMachine ? 'user' : 'machine';
            $duel->update(['resultado' => $winner]);
            if ($winner === 'user') {
                (new PointsController)->addPointsDuels($request);
            }
            return response()->json([
                'success' => true,
                'resultado' => $winner,
                'points_user' => $pointsUser,
                'points_machine' => $pointsMachine,
                'life_user' => $duel->lifeUser,
                'life_machine' => $duel->lifeMachine
            ], 200);
        }
    }

    public function selectMachineSpell($levelUser, $lifeUser, $lifeMachine, $spellsUsed)
    {
        $spells = Spell::where('level', '<=', $levelUser)->get()->diff($spellsUsed);
        //Compara 2 colecciones (diff)

        if ($lifeMachine < 30) {
            $spellMachine = $spells->filter(function ($spell) {
                return $spell->ataque > 70 || $spell->defensa > 70;
            })->random();
        } else {
            $spellMachine = $spells->random();
        }

        return $spellMachine;
    }

    public function applySpells($spellUser, $spellMachine, $duel)
    {
        $percentage = [
            'attack' => 0.25,
            'defense' => 0.24,
            'healing' => 0.25,
            'damage' => 0.24,
        ];

        $impactUser = (
            $spellUser->attack * $percentage['attack'] +
            $spellUser->defense * $percentage['defense'] +
            $spellUser->healing * $percentage['healing'] +
            $spellUser->damage * $percentage['damage']
        );

        $impactMachine = (
            $spellMachine->attack * $percentage['attack'] +
            $spellMachine->defense * $percentage['defense'] +
            $spellMachine->healing * $percentage['healing'] +
            $spellMachine->damage * $percentage['damage']
        );

        $duel->lifeUser -= $impactMachine;
        $duel->lifeMachine -= $impactUser;

        $duel->lifeUser += $spellUser->healing;
        $duel->lifeMachine += $spellMachine->healing;

        $duel->lifeUser = min($duel->lifeUser, 100);
        $duel->lifeMachine = min($duel->lifeMachine, 100);

        $duel->lifeUser = max($duel->lifeUser, 0);
        $duel->lifeMachine = max($duel->lifeMachine, 0);
    }
}
