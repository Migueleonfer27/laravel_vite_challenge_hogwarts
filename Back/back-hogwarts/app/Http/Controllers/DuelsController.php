<?php

namespace App\Http\Controllers;

use App\Models\Duel;
use App\Models\Spell;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\SpellController;

class DuelsController extends Controller
{

    // Recupera todos los duelos
    public function index()
    {
        $duels = Duel::all();

        if ($duels->isEmpty()) {
            return response()->json('Not found duels', 404);
        }
        return response()->json($duels, 200);
    }

    // Crea un duelo
    public function create(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        // Se valida que el usuario tenga hechizos para usar, si no tiene hechizos no puede iniciar un duelo.
        $response = (new SpellController)->getSpellsLearned()->getData();
        $spellUser = $response->spell;
        if (empty($spellUser)) {
            return response()->json([
                'codError' => 100,
                'success' => true,
                'message' => 'No hay hechizos disponibles'
            ], 400);
        }

        // Se crea y guarda el duelo en base de datos
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
            'data' => json_encode($duel),
            'success' => true,
            'message' => 'Duelo creado correctamente'
        ], 200);
    }

    // Recupera un duelo en por id
    public function show($id)
    {
        $duel = Duel::find($id);

        if (!$duel) {
            return response()->json('Not found duel', 404);
        }
        return response()->json($duel, 200);
    }

    // Recupera todos los duelos no terminados por usuario
    public function getUserActiveDuels(Request $request){
        $user = $request->user();
        if(!$user){
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado.'
            ],401);
        }

        $activeDuel = Duel::where('user_id', $user->id)
            ->where('result',0)
            ->get();

        if($activeDuel->isEmpty()){
            return response()->json([
                'success' => false,
                'message' => 'No se hay duelos activos.'
            ],404);
        }

        return response()->json([
            'success' => true,
            'activeDuels' => $activeDuel
        ],200);
    }

    public function castSpells(Request $request){
        $user = $request->user();
        if(!$user){
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado.'
            ], 401);
        }

        // Se recupera los datos del cliente
        $data = json_decode($request->getContent());
        $duel = $data->duel;
        $spellUser = $data->userSpell;

        // Buscar el duelo por ID
        $duel = Duel::find($duel->id);

        return response()->json([
            'success' => true,
            'duel' => json_encode($duel)
        ],200);
    }


    public function duelSimulation(Request $request, $duelId, PointsController $pointsController)
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

        // Ver si el duelo ha terminado
        if ($duel->round >= 5 || $duel->life_user <= 0 || $duel->life_machine <= 0 || $duel->points_user >= 3 || $duel->points_machine >= 3) {
            return response()->json([
                'success' => false,
                'message' => 'The duel has ended'
            ], 400);
        }

        // Ver si al usuario le quedan hechizos disponibles
        $usedSpellUser = $duel->spellsUsed()
            ->where('id_user', $user->id)
            ->pluck('spells.id')
            ->toArray();

        $availableSpellsUser = Spell::where('level', '<=', $levelUser)
            ->whereNotIn('id', $usedSpellUser)
            ->exists(); // Ver si hay hechizos disponibles

        if (!$availableSpellsUser) {
            // Si el usuario no tiene hechizos, termina el duelo
            return $this->endDuel($duel, $pointsController);
        }

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
        if (in_array($selectedSpellId, $usedSpellUser)) {
            return response()->json([
                'success' => false,
                'message' => 'The spell has already been used'
            ], 400);
        }

        // Incrementar contador de rondas y guardar el duelo
        $duel->round++;
        $duel->save();

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

        // Si no hay hechizos disponibles para la máquina, termina el duelo
        if (!$spellMachine) {
            return $this->endDuel($duel, $pointsController);
        }

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

        // Ver quien ha ganado el duelo
        if ($duel->points_user >= 3 || $duel->points_machine >= 3 || $duel->life_user <= 0 || $duel->life_machine <= 0) {
            return $this->endDuel($duel, $pointsController);
        }

        // Si no hay un ganador, devuelve la informacion
        return response()->json([
            'success' => true,
            'points_user' => $duel->points_user,
            'points_machine' => $duel->points_machine,
            'life_user' => $duel->life_user,
            'life_machine' => $duel->life_machine,
            'rounds' => $duel->round
        ], 200);
    }


    public function endDuel($duel, PointsController $pointsController){
        // Ver quien gana segun los puntos o las vidas vidas
        $result = $duel->points_user > $duel->points_machine || $duel->life_user > $duel->life_machine ? 1 : 2;
        $winner = $result === 1 ? 'user' : 'machine';

        // Modificar el resultado
        $duel->update(['result' => $result]);

        // Si el usuario gana, se suman puntos
        if ($result === 1) {
            $pointsController->addPointsDuels($duel->user);
        }

        return response()->json([
            'success' => true,
            'result' => $result,
            'winner' => $winner,
            'points_user' => $duel->points_user,
            'points_machine' => $duel->points_machine,
            'life_user' => $duel->life_user,
            'life_machine' => $duel->life_machine,
        ], 200);
    }


    public function selectMachineSpell($levelUser, $lifeUser, $lifeMachine, $spellsUsed)
    {
        $spells = Spell::where('level', '<=', $levelUser)
            ->whereNotIn('id', $spellsUsed) // Filtrar hechizos ya usados
            ->get();

        if ($spells->isEmpty()) {
            return Spell::where('level', '<=', $levelUser)->inRandomOrder()->first();
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
        // Porcentajes de los atributos del hechizo
        $percentage = [
            'attack' => 0.35,
            'defense' => 0.20,
            'healing' => 0.20,
            'damage' => 0.35,
            'summon' => 0.01,
            'action' => 0.01
        ];

        // Impacto usuario
        $impactUser = max(0, (
            ($spellUser->attack ?? 0) * $percentage['attack'] -
            ($spellMachine->defense ?? 0) * $percentage['defense'] +
            ($spellUser->healing ?? 0) * $percentage['healing'] -
            ($spellMachine->damage ?? 0) * $percentage['damage'] +
            ($spellUser->summon ?? 0) * $percentage['summon'] -
            ($spellMachine->action ?? 0) * $percentage['action']
        ));

        // Quitar vida aun que sea 1, para ver cambio
        if ($impactUser <= 0) {
            $impactUser = 1;
        }

        // Impacto maquina
        $impactMachine = max(0, (
            ($spellMachine->attack ?? 0) * $percentage['attack'] -
            ($spellUser->defense ?? 0) * $percentage['defense'] +
            ($spellMachine->healing ?? 0) * $percentage['healing'] -
            ($spellUser->damage ?? 0) * $percentage['damage'] +
            ($spellMachine->summon ?? 0) * $percentage['summon'] -
            ($spellUser->action ?? 0) * $percentage['action']
        ));

        // Quitar vida aun que sea 1, para ver cambio
        if ($impactMachine <= 0) {
            $impactMachine = 1;
        }

        // Vida usuario y maquina
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

    public function getDuelStatistics (Request $request){
        $user = $request->user();

        //REcuperar los duelos del usuario
        $duels = Duel::where('user_id', $user->id)->get();

        if($duels->isEmpty()){
            return response()->json([
                'success' => true,
                'message' => 'No se han encontrado duelos',
                'statistics' => [
                    'total_duels' => 0,
                    'won_duels' => 0,
                    'lost_duels' => 0,
                    'active_duels' => 0,
                ]
            ],200);
        }

        //Contar los duelos que ha ganado, perdido, empezado y ha realizado
        $totalDuels = $duels->count();
        $wonDuels = $duels->where('result,1')->count();
        $lostDuels = $duels->where('result,2')->count();
        $activeDuels = $duels->where('result,0')->count();

        return response()->json([
            'success' => true,
            'message' => 'No se han encontrado duelos',
            'statistics' => [
                'total_duels' => $totalDuels,
                'won_duels' => $wonDuels,
                'lost_duels' => $lostDuels,
                'active_duels' => $activeDuels,
            ]
        ],200);

    }

}
