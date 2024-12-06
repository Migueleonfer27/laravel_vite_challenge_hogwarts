<?php

namespace App\Http\Controllers;

use App\Models\Duel;
use App\Models\Spell;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\PointsController;

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
            'data' => $duel,
            'success' => true,
            'message' => 'Duelo creado correctamente'
        ], 200);
    }

    // Recupera un duelo en por id
    public function show($id)
    {
        $duel = Duel::with('spellsUsed')->find($id);

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

        // Se recupera los datos enviados desde el cliente
        $data = json_decode($request->getContent());
        $duel = $data->duel;

        // Se valida que el hechizo exista
        $spellUser = Spell::find($data->userSpell->id);
        if (!$spellUser) {
            return response()->json([
                'codError' => 100,
                'success' => false,
                'message' => 'El hechizo no existe'
            ]);
        }

        // Se valida que el duelo exista
        $duel = Duel::with('spellsUsed')->find($duel->id);
        if (!$duel) {
            return response()->json([
                'codError' => 101,
                'success' => false,
                'message' => 'Duelo no se pudo encontrar'
            ], 404);
        }

        // Se valida que el duelo no este terminado
        if($duel->result != 0){
            return response()->json([
                'codError' => 102,
                'success' => false,
                'message' => 'Duelo terinado'
            ], 404);
        }

        // Se valida que el hechizo no haya sido lanzado ya
        $usedSpellsUser = $duel->spellsUsed()
            ->where('id_user', $user->id)
            ->pluck('spells.id')
            ->toArray();

        if(in_array($spellUser->id, $usedSpellsUser)){
            return response()->json([
                'codError' => 103,
                'success' => false,
                'message' => 'El hechizo seleccionado ya se ha lanzado'
            ]);
        }

        // Se valida que el hechizo sea uno de los que el usuario ya tiene aprendidos y por tanto del nivel correcto
        $learnedSpellsUser = $user->spell->pluck('id')->toArray();

        if(!in_array($spellUser->id, $learnedSpellsUser)){
            return response()->json([
                'codError' => 104,
                'success' => false,
                'message' => 'El hechizo seleccionado no se ha aprendido por el usuario'
            ]);
        }


        // Se recupera el usuario maquina que sera el oponente de los duelos
        $machine = User::where('email', 'Machine@root.com')->first();
        if (!$machine) {
            return response()->json([
                'codError' => 105,
                'success' => false,
                'message' => 'Maquina no encontrada'
            ], 404);
        }

        // Se recuperan todos los hechizos creados en la aplicación con niveles menores e iguales al usuario del duelo.
        // Estos hechizos seran los que use la maquina para luchar
        $spellsToMachine = Spell::where('level', '<=', $user->level)->get();

        // Se recuperan los hechizos que ya ha lanzado la maquina
        $usedSpellMachine = $duel->spellsUsed()->wherePivot('id_user', $machine->id)->get();

        // Se filtran los hechizos ya lanzados de la maquina
        $availableSpellsMachine = $spellsToMachine->reject(function ($spell) use ($usedSpellMachine) {
            return $usedSpellMachine->contains('id', $spell->id);
        });

        // Se ejecuta la logia de la maquina para seleccionar hechizo
        $selectedSpellMachine = $this->selectMachineSpell($duel->life_user, $duel->life_machine, $availableSpellsMachine);

        // Se ejecuta el calculo de los hechizos
        $result = $this->applySpells($spellUser, $selectedSpellMachine, $duel->life_user, $duel->life_machine);

        // Se actualiza la información del duelo
        $duel->life_user = $result['lifeUser'];
        $duel->life_machine = $result['lifeMachine'];
        $duel->round++;

        // Determinar puntos en esta ronda
        if ($result['lifeUser'] > $result['lifeMachine']) {
            $duel->points_user++;
        } elseif ($result['lifeMachine'] > $result['lifeUser']) {
            $duel->points_machine++;
        }

        // Se guarda los hechizos lanzados del usuario y de la maquina en base de datos
        $duel->spellsUsed()->attach($spellUser, ['id_user' => $user->id]);
        $duel->spellsUsed()->attach($selectedSpellMachine, ['id_user' => $machine->id]);

        // Se calcula si la partida ha llegado a su final seteando el resultado
        $this->endDuel($duel, $learnedSpellsUser, $usedSpellsUser);

        // Se guarda el duelo en base de datos
        $duel->save();

        // Se actualiza la información de los hechizos lanzados en el modelo duelos, esto es necesario porque cuando recupero
        // el modelo duelo lo recupero con la relación de los hechizos lanzados y esta no se actualiza con el save()
        $duel->load('spellsUsed');

        // Se devuelve el resultado para que cliente lo gestione
        return response()->json([
            'success' => true,
            'duel' => $duel
        ],200);
    }

    public function endDuel($duel, $learnedSpellsUser, $usedSpellsUser){
        $pointsController = new PointsController();
        $user = 1;
        $machine = 2;
        $draw = 3;

        // Se obtienen los hechizos que le quedan al usuario
        $remainingSpellsUser = array_diff($learnedSpellsUser, $usedSpellsUser);

        // validamos si el duelo ha terminado cuando:
        // Si la ronda llega a 5,
        // o la vida de alguno llega a 0,
        // o la los puntos llegan a 3,
        // o el usuario esta juegando su ultima carta
        if( $duel->round > 5
            || $duel->life_user <= 0 || $duel->life_machine <= 0
            || $duel->points_machine >= 3 || $duel->points_user >= 3
            || count($remainingSpellsUser) == 1){

            // en el caso de que alguno de los dos gane 3 rondas
            if($duel->points_machine >= 3 || $duel->points_user >= 3){
                // Se calcula el ganador validado primero los puntos
                // Gana el usuario
                if($duel->points_user > $duel->points_machine){
                    $duel->update(['result' => $user]);
                    $pointsController->addPointsDuels();
                }
                // Gana la maquina
                elseif ($duel->points_user < $duel->points_machine){
                    $duel->update(['result' => $machine]);
                }
                // En este caso no se puede dar empate al solo tener 5 rondas
            }
            // en el caso de que alguno de los dos haya perdido toda la vida
            elseif ($duel->life_user <= 0 || $duel->life_machine <= 0){
                // Se calcula el ganador validado primero la vida
                // Gana el usuario
                if($duel->life_machine <= 0){
                    $duel->update(['result' => $user]);
                    $pointsController->addPointsDuels();
                }
                // Gana la maquina
                elseif ($duel->life_user <= 0){
                    $duel->update(['result' => $machine]);
                }
                // Se quedan empate, los dos llegan con la vida a 0, entonces usamos las rondas para saber quien gana
                else {
                    // gana el usuario
                    if($duel->points_user > $duel->points_machine){
                        $duel->update(['result' => $user]);
                        $pointsController->addPointsDuels();
                    }
                    // Gana la maquina
                    elseif ($duel->points_user < $duel->points_machine){
                        $duel->update(['result' => $machine]);
                    }
                    // si tambien se da un empate, pues empate
                    else {
                        $duel->update(['result' => $draw]);
                    }
                }
            }
            // en el caso de que las rondas llegen a 5
            else {
                // Se calcula el ganador validado primero los puntos
                // Gana el usuario
                if($duel->points_user > $duel->points_machine){
                    $duel->update(['result' => $user]);
                    $pointsController->addPointsDuels();
                }
                // Gana la maquina
                elseif ($duel->points_user < $duel->points_machine){
                    $duel->update(['result' => $machine]);
                }
                // En el caso de empate de puntos, usamos la vida para calcular el ganador
                else {
                    // Gana el usuario
                    if($duel->life_user > $duel->life_machine){
                        $duel->update(['result' => $user]);
                        $pointsController->addPointsDuels();
                    }
                    // Gana la maquina
                    elseif ($duel->life_user < $duel->life_machine){
                        $duel->update(['result' => $machine]);
                    }
                    // si tambien se da un empate, pues empate
                    else {
                        $duel->update(['result' => $draw]);
                    }
                }
            }
        }
    }

    // Función con la logica para que la maquina decida que hechizo escoger
    public function selectMachineSpell($lifeUser, $lifeMachine, $spells){
        // Evaluar cada hechizo, se ordena y se coge el de mayor puntuación
        $bestSpell = $spells->map(function ($spell) use ($lifeUser, $lifeMachine) {
            $score = 0;

            // Priorizar defensa y curación si la vida de la máquina es baja
            if ($lifeMachine < 30) {
                $score += ($spell->defense ?? 0) * 1.5; // Valorar más la defensa
                $score += ($spell->healing ?? 0) * 1.5; // Valorar más la curación
            }

            // Priorizar ataque y daño si la vida del usuario es baja
            if ($lifeUser < 30) {
                $score += ($spell->attack ?? 0) * 1.5; // Valorar más el ataque
                $score += ($spell->damage ?? 0) * 1.5; // Priorizar daño directo
            }

            // Se da mas prioriad a los hechizos que esten mas valanceados
            $score += ($spell->attack ?? 0) * 0.7;
            $score += ($spell->defense ?? 0) * 0.7;
            $score += ($spell->healing ?? 0) * 0.5;

            // Se da mas prioridad a los hechizos que tengan alguna de estos atributos
            $score += ($spell->summon ?? 0) * 0.3;
            $score += ($spell->action ?? 0) * 0.3;

            // Se guarda puntuacion para comparar puntos
            $spell->score = $score;
            return $spell;
        })->sortByDesc('score')->first();

        // Si no se encuentra un hechizo específico, elegir uno al azar
        return $bestSpell ?? $spells->random();
    }

    public function applySpells($spellUser, $spellMachine, $lifeUser, $lifeMachine){
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

        // Si el impacto es negativo, asignamos un mínimo de 1 para que haya un cambio visible
        if ($impactUser <= 0) {
            $impactUser = 1;
        }

        // Impacto máquina
        $impactMachine = max(0, (
            ($spellMachine->attack ?? 0) * $percentage['attack'] -
            ($spellUser->defense ?? 0) * $percentage['defense'] +
            ($spellMachine->healing ?? 0) * $percentage['healing'] -
            ($spellUser->damage ?? 0) * $percentage['damage'] +
            ($spellMachine->summon ?? 0) * $percentage['summon'] -
            ($spellUser->action ?? 0) * $percentage['action']
        ));

        // Si el impacto es negativo, asignamos un mínimo de 1 para que haya un cambio visible
        if ($impactMachine <= 0) {
            $impactMachine = 1;
        }

        // Calcular la nueva vida del usuario y de la máquina
        $newLifeUser = max(0, $lifeUser - $impactMachine);
        $newLifeMachine = max(0, $lifeMachine - $impactUser);

        // Si la máquina se cura, la vida no debe superar 100
        if ($spellMachine->healing > 0 && $impactMachine > 0) {
            $newLifeMachine = min(100, $newLifeMachine + ($impactMachine * $percentage['healing']));
        }

        // Si el usuario se cura, la vida no debe superar 100
        if ($spellUser->healing > 0 && $impactUser > 0) {
            $newLifeUser = min(100, $newLifeUser + ($impactUser * $percentage['healing']));
        }

        // Devuelve la nueva vida y los impactos calculados
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
        $wonDuels = $duels->where('result', 1)->count();
        $lostDuels = $duels->where('result', 2)->count();
        $activeDuels = $duels->where('result', 0)->count();

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
