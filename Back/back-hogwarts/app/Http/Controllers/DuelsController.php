<?php

namespace App\Http\Controllers;

use App\Models\Duel;
use App\Http\Controllers\PointsController;
use App\Models\Spell;
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
        $duels = Duel::find($id);

        if (!$duels) {
            return response()->json('Not found duels', 404);
        }
        return response()->json($duels, 200);
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
        $duel->user_id = $user->id;
        $duel->resultado = 0;
        $duel->save();

        return response()->json([
            'duel' => $duel,
            'success' => true,
            'message' => 'Duelo creado correctamente'
        ], 200);
    }

    public function startDuel(Request $request)
    {
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
            'resultado' => 0,
        ]);

        // Inicializar variables de vida y hechizos usados
        $duel->lifeUser = 100;
        $duel->lifeMachine = 100;
        $spellsUsed = []; // Reiniciar la lista de hechizos usados

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
        $pointsUser = 0;
        $pointsMachine = 0;

        $duel = Duel::find($duelId);

        if (!$duel) {
            return response()->json([
                'success' => false,
                'message' => 'Duel not found'
            ], 404);
        }

        // Recuperar la vida actual desde la sesión o inicializarla en 100 si no existe
        $lifeUser = session("lifeUser_{$duelId}", 100);
        $lifeMachine = session("lifeMachine_{$duelId}", 100);

        // Recuperar el número de rondas desde la sesión o inicializarlo en 0 si no existe
        $rounds = session("rounds_{$duelId}", 0);

        // Verificar si se alcanzaron las 5 rondas o si alguien ganó
        if ($rounds >= 5 || $pointsUser == 3 || $pointsMachine == 3 || $lifeUser <= 0 || $lifeMachine <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'El duelo ha finalizado'
            ], 400);
        }

        // Incrementar contador de rondas
        $rounds++;
        session(["rounds_{$duelId}" => $rounds]);

        // Obtener hechizo seleccionado por el usuario
        $selectedSpellId = $request->input('spell_id');
        $selectedSpell = Spell::find($selectedSpellId);

        if (!$selectedSpell || $selectedSpell->level > $levelUser) {
            return response()->json([
                'success' => false,
                'message' => 'El hechizo no es válido para tu nivel'
            ], 400);
        }

        // Obtener hechizos usados previamente
        $spellsUsed = $duel->spellsUsed->pluck('id')->toArray();

        // Seleccionar hechizo de la máquina
        $spellMachine = $this->selectMachineSpell($levelUser, $lifeUser, $lifeMachine, $spellsUsed);

        // Aplicar los hechizos y determinar el impacto en la vida
        $this->applySpells($selectedSpell, $spellMachine, $lifeUser, $lifeMachine);

        // Guardar los cambios de vida en la sesión
        session(["lifeUser_{$duelId}" => $lifeUser]);
        session(["lifeMachine_{$duelId}" => $lifeMachine]);

        // Solo insertar los hechizos que se están usando en esta ronda
        if (!in_array($selectedSpell->id, $spellsUsed)) {
            $duel->spellsUsed()->syncWithoutDetaching([$selectedSpell->id]);
        }
        if (!in_array($spellMachine->id, $spellsUsed)) {
            $duel->spellsUsed()->syncWithoutDetaching([$spellMachine->id]);
        }

        // Verificar quién gana la ronda
        if ($lifeUser > $lifeMachine) {
            $pointsUser++;
        } else {
            $pointsMachine++;
        }

        // Verificar si alguien ha ganado el duelo
        if ($pointsUser === 3 || $pointsMachine === 3 || $lifeUser <= 0 || $lifeMachine <= 0) {
            $resultado = $pointsUser === 3 ? 1 : ($pointsMachine === 3 ? 2 : ($lifeUser <= 0 ? 2 : 1));
            $winner = $resultado === 1 ? 'user' : 'machine';

            $duel->update(['resultado' => $resultado]);

            if ($resultado === 1) {
                (new PointsController)->addPointsDuels($request);
            }

            // Limpiar las variables de sesión al finalizar el duelo
            session()->forget("lifeUser_{$duelId}");
            session()->forget("lifeMachine_{$duelId}");
            session()->forget("rounds_{$duelId}");

            return response()->json([
                'success' => true,
                'resultado' => $resultado,
                'winner' => $winner,
                'points_user' => $pointsUser,
                'points_machine' => $pointsMachine,
                'life_user' => $lifeUser,
                'life_machine' => $lifeMachine
            ], 200);
        }

        // Si no hay un ganador, retornar el estado actual
        return response()->json([
            'success' => true,
            'points_user' => $pointsUser,
            'points_machine' => $pointsMachine,
            'life_user' => $lifeUser,
            'life_machine' => $lifeMachine,
            'rounds' => $rounds
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

    public function applySpells($spellUser, $spellMachine, &$lifeUser, &$lifeMachine)
    {
        $percentage = [
            'attack' => 0.30,
            'defense' => 0.15,
            'healing' => 0.20,
            'damage' => 0.35,
            'summon' => 0.05,
            'action' => 0.05
        ];

        $impactUser = max(0, (
            ($spellUser->attack ?? 0 * $percentage['attack'] * $lifeMachine / 100) +
            ($spellUser->defense ?? 0 * $percentage['defense'] * $lifeUser / 100) +
            ($spellUser->healing ?? 0 * $percentage['healing'] * $lifeUser / 100) -
            ($spellUser->damage ?? 0 * $percentage['damage'] * $lifeMachine / 100) +
            ($spellUser->summon ?? 0 * $percentage['summon'] * $lifeMachine / 100) -
            ($spellUser->action ?? 0 * $percentage['action'] * $lifeMachine / 100)
        ));

        $impactMachine = max(0, (
            ($spellMachine->attack ?? 0 * $percentage['attack'] * $lifeUser / 100) +
            ($spellMachine->defense ?? 0 * $percentage['defense'] * $lifeMachine / 100) +
            ($spellMachine->healing ?? 0 * $percentage['healing'] * $lifeMachine / 100) -
            ($spellMachine->damage ?? 0 * $percentage['damage'] * $lifeUser / 100) +
            ($spellMachine->summon ?? 0 * $percentage['summon'] * $lifeUser / 100) -
            ($spellMachine->action ?? 0 * $percentage['action'] * $lifeUser / 100)
        ));

        $lifeUser -= $impactMachine;
        $lifeMachine -= $impactUser;
    }
}
