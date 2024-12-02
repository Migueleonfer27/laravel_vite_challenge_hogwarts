<?php

namespace App\Http\Controllers;

use App\Models\Duel;
use App\Http\Controllers\PointsController;
use App\Models\Spell;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DuelsController extends Controller
{
    public function index()
    {
        $duels = Duel::all();

        if ($duels->isEmpty()) {
            return response()->json('Not found duels', 404);
        }
        return response()->json($duels, 200);
    }

    public function show($id)
    {
        $duel = Duel::find($id);

        if (!$duel) {
            return response()->json('Not found duel', 404);
        }
        return response()->json($duel, 200);
    }

    public function create(Request $request)
    {
        $user = $request->user(); // Obtiene el usuario autenticado


        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        $duel = new Duel();
        $duel->fill([
            'id_user' => $user->id,
            'life_user' => 100,
            'life_machine' => 100,
            'round' => 0,
            'result' => 0,
        ]);
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
        if ($spellUser->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'No hay hechizos disponibles'
            ], 400);
        }

        // Crear un nuevo duelo y reiniciar la lista de hechizos usados
        $duel = Duel::create([
            'user_id' => $user->id,
        ]);

        return response()->json([
            'duel' => $duel,
            'success' => true,
            'message' => 'Duel started',
        ], 200);
    }

    public function duelSimulation(Request $request, $duelId)
    {
        $user = $request->user();
        $levelUser = $user->level;

        // Buscar el duelo por ID
        $duel = Duel::find($duelId);

        if (!$duel) {
            return response()->json([
                'success' => false,
                'message' => 'Duel not found'
            ], 404);
        }

        // Verificar si el duelo ya terminó
        if ($duel->round >= 5 || $duel->life_user <= 0 || $duel->life_machine <= 0 || $duel->points_user >= 3 || $duel->points_machine >= 3) {
            return response()->json([
                'success' => false,
                'message' => 'The duel has ended'
            ], 400);
        }

        // Incrementar contador de rondas
        $duel->round++;
        $duel->save();

        // Obtener hechizo seleccionado por el usuario
        $selectedSpellId = $request->input('spell_id');
        $selectedSpell = Spell::find($selectedSpellId);

        if (!$selectedSpell || $selectedSpell->level > $levelUser) {
            return response()->json([
                'success' => false,
                'message' => 'The spell is not valid for your level'
            ], 400);
        }

        // Verificar si el usuario ya ha usado este hechizo
        $usedSpellUser = $duel->spellsUsed()
            ->where('id_user', $user->id)
            ->pluck('spells.id') // Referencia explícita a la tabla 'spells'
            ->toArray();

        if (in_array($selectedSpellId, $usedSpellUser)) {
            return response()->json([
                'success' => false,
                'message' => 'The spell has already been used'
            ], 400);
        }

        // Buscar la máquina
        $machine = User::where('email', 'Machine@root.com')->first();
        if (!$machine) {
            return response()->json([
                'success' => false,
                'message' => 'Machine not found'
            ], 404);
        }
        $machineId = $machine->id;

        // Guardar hechizo del usuario
        $duel->spellsUsed()->attach($selectedSpell, ['id_user' => $user->id]);

        // Sacar hechizo de la máquina
        $spellsUsed = $duel->spellsUsed->pluck('id')->toArray();
        $spellMachine = $this->selectMachineSpell($levelUser, $duel->life_user, $duel->life_machine, $spellsUsed);

        $duel->spellsUsed()->attach($spellMachine, ['id_user' => $machineId]);

        // Aplicar hechizos y obtener nuevas vidas
        $newLifeValues = $this->applySpells($selectedSpell, $spellMachine, $duel->life_user, $duel->life_machine);

        // Actualizar los valores de vida en el modelo
        $duel->life_user = $newLifeValues['lifeUser'];
        $duel->life_machine = $newLifeValues['lifeMachine'];

        // Determinar puntos en esta ronda
        if ($newLifeValues['lifeUser'] > $newLifeValues['lifeMachine']) {
            $duel->points_user++;
        } elseif ($newLifeValues['lifeMachine'] > $newLifeValues['lifeUser']) {
            $duel->points_machine++;
        }

        $duel->save();

        // Verificar si alguien ha ganado el duelo
        if (
            $duel->points_user >= 3 ||
            $duel->points_machine >= 3 ||
            $duel->life_user <= 0 ||
            $duel->life_machine <= 0
        ) {
            $resultado = $duel->points_user >= 3 ? 1 : 2;
            $winner = $resultado === 1 ? 'user' : 'machine';

            $duel->update(['result' => $resultado]);

            if ($resultado === 1) {
                (new PointsController)->addPointsDuels($request);
            }

            return response()->json([
                'success' => true,
                'result' => $resultado,
                'winner' => $winner,
                'points_user' => $duel->points_user,
                'points_machine' => $duel->points_machine,
                'life_user' => $duel->life_user,
                'life_machine' => $duel->life_machine
            ], 200);
        }

        // Si no hay un ganador, retornar el estado actual
        return response()->json([
            'success' => true,
            'points_user' => $duel->points_user,
            'points_machine' => $duel->points_machine,
            'life_user' => $duel->life_user,
            'life_machine' => $duel->life_machine,
            'rounds' => $duel->round
        ], 200);
    }


    public function selectMachineSpell($levelUser, $lifeUser, $lifeMachine, $spellsUsed)
    {
        $spells = Spell::where('level', '<=', $levelUser)
            ->whereNotIn('id', $spellsUsed) // Filtrar hechizos ya usados
            ->get();

        if ($spells->isEmpty()) {
            return Spell::where('level', '<=', $levelUser)->inRandomOrder()->first(); // Hechizo aleatorio de respaldo
        }

        $spellMachine = $spells->filter(function ($spell) use ($lifeMachine, $lifeUser) {
            if ($lifeMachine < 30) {
                return $spell->attack > 70 || $spell->defense > 70;
            } elseif ($lifeUser < 30) {
                return $spell->attack > 50;
            }
            return true;
        })->first();

        if (!$spellMachine) {
            $spellMachine = $spells->random();
        }

        return $spellMachine;
    }

    public function applySpells($spellUser, $spellMachine, $lifeUser, $lifeMachine)
    {
        // Porcentajes para el cálculo
        $percentage = [
            'attack' => 0.35,
            'defense' => 0.20,
            'healing' => 0.20,
            'damage' => 0.35,
            'summon' => 0.01,
            'action' => 0.01
        ];

        // Cálculo del impacto del usuario
        $impactUser = max(0, (
            ($spellUser->attack ?? 0) * $percentage['attack'] -
            ($spellMachine->defense ?? 0) * $percentage['defense'] +
            ($spellUser->healing ?? 0) * $percentage['healing'] -
            ($spellMachine->damage ?? 0) * $percentage['damage'] +
            ($spellUser->summon ?? 0) * $percentage['summon'] -
            ($spellMachine->action ?? 0) * $percentage['action']
        ));

        // Aseguramos que el impacto mínimo sea 1
        if ($impactUser <= 0) {
            $impactUser = 1;
        }

        // Cálculo del impacto de la máquina
        $impactMachine = max(0, (
            ($spellMachine->attack ?? 0) * $percentage['attack'] -
            ($spellUser->defense ?? 0) * $percentage['defense'] +
            ($spellMachine->healing ?? 0) * $percentage['healing'] -
            ($spellUser->damage ?? 0) * $percentage['damage'] +
            ($spellMachine->summon ?? 0) * $percentage['summon'] -
            ($spellUser->action ?? 0) * $percentage['action']
        ));

        // Aseguramos que el impacto mínimo sea 1
        if ($impactMachine <= 0) {
            $impactMachine = 1;
        }

        // Cálculo de la nueva vida de la máquina y del usuario
        $newLifeUser = max(0, $lifeUser - $impactMachine);
        $newLifeMachine = max(0, $lifeMachine - $impactUser);

        // Si la máquina se cura, la vida no debe superar 100
        if ($spellMachine->healing > 0) {
            $newLifeMachine = min(100, $newLifeMachine + ($impactMachine * $percentage['healing']));
        }

        // Si el usuario se cura, la vida no debe superar 100
        if ($spellUser->healing > 0) {
            $newLifeUser = min(100, $newLifeUser + ($impactUser * $percentage['healing']));
        }


        return [
            'lifeUser' => $newLifeUser,
            'lifeMachine' => $newLifeMachine,
            'impactUser' => $impactUser,
            'impactMachine' => $impactMachine
        ];
    }



}
