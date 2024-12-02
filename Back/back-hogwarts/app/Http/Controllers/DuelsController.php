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
            'user_id' => $user->id,
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
        $pointsUser = 0;
        $pointsMachine = 0;

        // Buscar el duelo por ID
        $duel = Duel::find($duelId);

        if (!$duel) {
            return response()->json([
                'success' => false,
                'message' => 'Duel not found'
            ], 404);
        }

        // Verificar si el duelo ya tiene el máximo de rondas o si uno de los participantes ha perdido toda la vida
        if ($duel->round >= 5 || $duel->life_user <= 0 || $duel->life_machine <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'The duel has ended'
            ], 400);
        }

        // Incrementar contador de rondas solo si no se ha alcanzado el máximo
        $rounds = $duel->round + 1;
        $duel->round = $rounds;
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

        // Guardar hechizo del usuario
        $duel->spellsUsed()->attach($selectedSpell);

        // Sacar hechizo de la máquina
        $spellsUsed = $duel->spellsUsed->pluck('id')->toArray();
        $spellMachine = $this->selectMachineSpell($levelUser, $duel->life_user, $duel->life_machine, $spellsUsed);

        $duel->spellsUsed()->attach($spellMachine);

        // Aplicar hechizos y obtener nuevas vidas
        $newLifeValues = $this->applySpells($selectedSpell, $spellMachine, $duel->life_user, $duel->life_machine);

        // Actualizar los valores de vida en el modelo
        $duel->life_user = $newLifeValues['lifeUser'];
        $duel->life_machine = $newLifeValues['lifeMachine'];
        $duel->save();

        if ($duel->life_user > $duel->life_machine) {
            $pointsUser++;
        } elseif ($duel->life_machine > $duel->life_user) {
            $pointsMachine++;
        }

        // Verificar si alguien ha ganado el duelo
        if ($pointsUser === 3 || $pointsMachine === 3 || $duel->life_user <= 0 || $duel->life_machine <= 0) {
            $resultado = $pointsUser === 3 ? 1 : ($pointsMachine === 3 ? 2 : ($duel->life_user <= 0 ? 2 : 1));
            $winner = $resultado === 1 ? 'user' : 'machine';

            $duel->update(['result' => $resultado]);

            if ($resultado === 1) {
                (new PointsController)->addPointsDuels($request);
            }

            return response()->json([
                'success' => true,
                'result' => $resultado,
                'winner' => $winner,
                'points_user' => $pointsUser,
                'points_machine' => $pointsMachine,
                'life_user' => $duel->life_user,
                'life_machine' => $duel->life_machine
            ], 200);
        }

        // Si no hay un ganador, retornar el estado actual
        return response()->json([
            'success' => true,
            'points_user' => $pointsUser,
            'points_machine' => $pointsMachine,
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
        // Ajustamos los porcentajes para que la suma total sea 100 y summon y action sean 0.01
        $percentage = [
            'attack' => 0.35,   // 35%
            'defense' => 0.20,  // 20%
            'healing' => 0.20,  // 20%
            'damage' => 0.35,   // 35%
            'summon' => 0.01,   // 1%
            'action' => 0.01    // 1%
        ];

        // Calculamos el impacto del usuario
        $impactUser = max(0, (
            ($spellUser->attack ?? 0 * $percentage['attack'] * $lifeMachine / 100) +
            ($spellUser->defense ?? 0 * $percentage['defense'] * $lifeUser / 100) +
            ($spellUser->healing ?? 0 * $percentage['healing'] * $lifeUser / 100) -
            ($spellUser->damage ?? 0 * $percentage['damage'] * $lifeMachine / 100) +
            ($spellUser->summon ?? 0 * $percentage['summon'] * $lifeMachine / 100) -
            ($spellUser->action ?? 0 * $percentage['action'] * $lifeMachine / 100)
        ));

        // Aseguramos que siempre haya un impacto, incluso si es pequeño
        if ($impactUser <= 0) {
            $impactUser = 1; // Forzar un impacto mínimo
        }

        // Calculamos el impacto de la máquina
        $impactMachine = max(0, (
            ($spellMachine->attack ?? 0 * $percentage['attack'] * $lifeUser / 100) +
            ($spellMachine->defense ?? 0 * $percentage['defense'] * $lifeMachine / 100) +
            ($spellMachine->healing ?? 0 * $percentage['healing'] * $lifeMachine / 100) -
            ($spellMachine->damage ?? 0 * $percentage['damage'] * $lifeUser / 100) +
            ($spellMachine->summon ?? 0 * $percentage['summon'] * $lifeUser / 100) -
            ($spellMachine->action ?? 0 * $percentage['action'] * $lifeUser / 100)
        ));

        // Aseguramos que siempre haya un impacto, incluso si es pequeño
        if ($impactMachine <= 0) {
            $impactMachine = 1; // Forzar un impacto mínimo
        }

        // Calculamos nuevas vidas después de aplicar los impactos
        $newLifeUser = max(0, min(100, $lifeUser - $impactMachine + $impactUser));
        $newLifeMachine = max(0, min(100, $lifeMachine - $impactUser + $impactMachine));

        // Si hay curación (impactos positivos), permitimos que la vida suba un poco, pero no más de 100
        if ($spellUser->healing > 0) {
            $newLifeUser = min(100, $newLifeUser + ($impactUser * 0.5)); // Ajustamos la cantidad de curación
        }

        if ($spellMachine->healing > 0) {
            $newLifeMachine = min(100, $newLifeMachine + ($impactMachine * 0.5)); // Ajustamos la cantidad de curación
        }

        // Log para depuración
        Log::info('Impacto calculado del usuario', ['impactUser' => $impactUser, 'newLifeUser' => $newLifeUser]);
        Log::info('Impacto calculado de la máquina', ['impactMachine' => $impactMachine, 'newLifeMachine' => $newLifeMachine]);

        // Retornamos las nuevas vidas calculadas y los impactos
        return [
            'lifeUser' => $newLifeUser,
            'lifeMachine' => $newLifeMachine,
            'impactUser' => $impactUser,
            'impactMachine' => $impactMachine
        ];
    }

}
