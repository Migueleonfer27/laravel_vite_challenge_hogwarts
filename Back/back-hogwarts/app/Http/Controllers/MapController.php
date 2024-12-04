<?php

namespace App\Http\Controllers;

use App\Models\Map;
use App\Models\Cell;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MapController extends Controller
{

    public function showMap($id)
    {
        $map = DB::table('maps')
            ->join('cells', 'maps.id', '=', 'cells.map_id')
            ->where('maps.id', $id)
            ->select('cells.posicion_x', 'cells.posicion_y', 'cells.content', 'cells.second_content')
            ->get();;

        $grid = [];
        foreach ($map as $cell) {
            $grid[$cell->posicion_y][$cell->posicion_x] = $cell->content ?? '-';
        }

        return response()->json(['message' => 'Mapa obtenido', 'map' => $grid], 200);

    }



    public function createMap($id)
    {
        $map = Map::create([
            'name' => 'Mapa Merodeador Simulacion',
        ]);

        $doorPositions = [
            [1, 6],
            [3, 1],
            [5, 8],
            [7, 3]
        ];

        for ($y = 1; $y <= 7; $y++) {
            for ($x = 1; $x <= 8; $x++) {
                $isDoor = false;
                foreach ($doorPositions as $door) {
                    if ($door[0] === $y && $door[1] === $x) {
                        $isDoor = true;
                        break;
                    }
                }

                $content = null;

                if ($isDoor) {
                    $content = 'PUERTA';
                } elseif ($y == 1 || $y == 7 || $x == 1 || $x == 8) {
                    $content = 'XXXX';
                }

                Cell::create([
                    'map_id' => $map->id,
                    'posicion_x' => $x,
                    'posicion_y' => $y,
                    'content' => $content,
                    'second_content' => 0,
                ]);
            }
        }

       return response()->json(['message' => 'Mapa creado con puertas', 'map' => $map], 200);
    }

    public function createCells($id){

        $map = Map::find($id);

        $doorPositions = [
                    [1, 6],
                    [3, 1],
                    [5, 8],
                    [7, 3]
                ];

                for ($y = 1; $y <= 7; $y++) {
                    for ($x = 1; $x <= 8; $x++) {
                        $isDoor = false;
                        foreach ($doorPositions as $door) {
                            if ($door[0] === $y && $door[1] === $x) {
                                $isDoor = true;
                                break;
                            }
                        }

                        $content = null;

                        if ($isDoor) {
                            $content = 'PUERTA';
                        } elseif ($y == 1 || $y == 7 || $x == 1 || $x == 8) {
                            $content = 'XXXX';
                        }

                        Cell::create([
                            'map_id' => $map->id,
                            'posicion_x' => $x,
                            'posicion_y' => $y,
                            'content' => $content,
                            'second_content' => 0,
                        ]);
                    }
                }
    }

    public function getStudent(){
        $students = DB::table('users as u')
            ->join('role_user as ru', 'u.id', '=', 'ru.user_id')
            ->join('roles as r', 'ru.role_id', '=', 'r.id')
            ->where('r.name', '=', 'student')
            ->inRandomOrder()
            ->pluck('u.name')
            ->toArray();
        return $students;
    }

    public function getMap($id){
        $map = Map::find($id);
        return $map;
    }

    public $studentsInMap = [];
    public $studentsNotInMap = [];

    public function insertUsers($id)
    {
        $students = $this->getStudent();
        $map = $this->getMap($id);
        $cells = $map->cells()->update(['second_content' => 0]);

        // Limitar el número de estudiantes a insertar entre 0 y 4
        $studentsToInsert = collect($students)->take(rand(0, 4));

        foreach ($studentsToInsert as $student) {
            $randomRow = rand(2, 6);
            $randomCol = rand(1, 8);
            $cell = $map->cells()
                ->where('posicion_x', $randomCol)
                ->where('posicion_y', $randomRow)
                ->first();
            if ($cell && is_null($cell->content)) {
                $cell->content = $student;
                $cell->save();
                $this->studentsInMap[] = $student;
            }
        }

        foreach (array_diff($students, $studentsToInsert->toArray()) as $student) {
            $this->studentsNotInMap[] = $student;
        }

        return response()->json(['message' => 'Usuarios insertados', 'studentsInMap' => $this->studentsInMap, 'studentsNotInMap' => $this->studentsNotInMap], 200);
    }

    public function insertStudentAtDoor($id, $second)
    {
        // Verificar si hay estudiantes en la lista de estudiantes no en el mapa
        if (empty($this->studentsNotInMap)) {
            return response()->json(['message' => 'No hay estudiantes disponibles para insertar'], 200);
        }

        // Obtener el mapa
        $map = Map::find($id);

        // Definir las posiciones adyacentes a las puertas
        $doorAdjacentPositions = [
            [2, 6], // Adyacentes a la puerta en [1, 6]
            [3, 2], // Adyacentes a la puerta en [3, 1]
            [5, 7], // Adyacentes a la puerta en [5, 8]
            [6, 3]  // Adyacentes a la puerta en [7, 3]
        ];

        // Seleccionar aleatoriamente una posición adyacente a una puerta
        $randomPosition = $doorAdjacentPositions[array_rand($doorAdjacentPositions)];

        // Seleccionar aleatoriamente un estudiante de la lista de estudiantes no en el mapa
        $randomStudentKey = array_rand($this->studentsNotInMap);
        $randomStudent = $this->studentsNotInMap[$randomStudentKey];

        // Verificar si la celda está vacía
        $cell = $map->cells()
            ->where('posicion_x', $randomPosition[1])
            ->where('posicion_y', $randomPosition[0])
            ->where('second_content', $second - 1)
            ->first();

        if ($cell && is_null($cell->content)) {
            // Insertar el estudiante en la celda
            $cell->content = $randomStudent;
            $cell->save();

            // Actualizar las variables globales
            $this->studentsInMap[] = $randomStudent;
            unset($this->studentsNotInMap[$randomStudentKey]);

            return response()->json(['message' => 'Estudiante insertado en la puerta', 'student' => $randomStudent], 200);
        } else {
            return response()->json(['message' => 'La celda adyacente a la puerta no está disponible'], 200);
        }
    }


    public function moveUser($id, $second)
{
    $positions = [
        ['x' => -1, 'y' => 0], // izquierda
        ['x' => 1, 'y' => 0],  // derecha
        ['x' => 0, 'y' => -1], // arriba
        ['x' => 0, 'y' => 1]   // abajo
    ];
    shuffle($positions);
    $adjacentPositions = $positions;

    $map = Map::find($id);

    if (!$map) {
        return response()->json(['message' => 'Mapa no encontrado'], 404);
    }

    $originalCells = $map->cells()->where('second_content', $second - 1)->get();
    $movedStudents = [];

    foreach ($originalCells as $cell) {
        $newCellContent = $cell->content;
        $secondContent = $second;
        $moved = false;

        if ($cell->content == "XXXX" || $cell->content == "PUERTA") {
            if ($cell->content !== null) {
                $cell->update(['second_content' => $secondContent]);
            }
        } elseif ($cell->content) {
            foreach ($adjacentPositions as $position) {
                $newX = $cell->posicion_x + $position['x'];
                $newY = $cell->posicion_y + $position['y'];

                if ($newX > 0 && $newX <= 8 && $newY > 0 && $newY <= 7) {
                    $newCell = $map->cells()
                        ->where('posicion_x', $newX)
                        ->where('posicion_y', $newY)
                        ->where('second_content', $second - 1)
                        ->first();

                    if ($newCell && !$newCell->content && !$moved) {
                        if ($newCell->content == "PUERTA") {
                            $this->studentsInMap = array_diff($this->studentsInMap, [$cell->content]);
                            $this->studentsNotInMap[] = $cell->content;
                        } else {
                            $movedStudents[] = [
                                'student' => $cell->content,
                                'from' => ['x' => $cell->posicion_x, 'y' => $cell->posicion_y],
                                'to' => ['x' => $newX, 'y' => $newY]
                            ];

                            $newCell->update([
                                'content' => $cell->content,
                                'second_content' => $secondContent,
                            ]);
                        }

                        $cell->update([
                            'content' => null,
                            'second_content' => $secondContent,
                        ]);

                        $moved = true;
                    }
                }
            }

            if (!$moved) {
                $cell->update([
                    'second_content' => $secondContent,
                ]);
            }
        } else {
            $cell->update([
                'second_content' => $secondContent,
            ]);
        }
    }

    return response()->json(['message' => 'Usuarios movidos', 'map' => $map, 'movedStudents' => $movedStudents], 200);
}


    public function deletePreviousMap($id)
    {
        $map = Map::find($id);
        $map->cells()->delete();

        return response()->json(['message' => 'Mapa eliminado'], 200);
    }


    public function simulationMap($id, $second){


        if ($map = Map::find($id)) {
            $this->deletePreviousMap($id);
            $this->createCells($id);
        }else {
            $this->createMap($id);
        }

        $this->insertUsers($id);

        for ($i = 1; $i <= $second; $i++) {
            $random = rand(0, 1);
            if ($random == 1) {
                $this->insertStudentAtDoor($id, $i);
            }
            $this->moveUser($id, $i);
        }

        $map = DB::table('maps')
            ->join('cells', 'maps.id', '=', 'cells.map_id')
            ->where('maps.id', $id)
            ->where('second_content', $second)
            ->select('cells.posicion_x', 'cells.posicion_y', 'cells.content', 'cells.second_content')
            ->get();

        return response()->json(['message' => 'simulacion creada', 'map', $map], 200);
    }



//     public function insertUsers($id)
//     {
//         $students = DB::table('users as u')
//             ->select('u.name')
//             ->join('role_user as ru', 'u.id', '=', 'ru.user_id')
//             ->join('roles as r', 'ru.role_id', '=', 'r.id')
//             ->where('r.name', '=', 'student')
//             ->inRandomOrder()
//             ->get();
//         $randomizedStudents = $students->shuffle();
//
//         $map = Map::find($id);
//         $cells = $map->cells()->update(['second_content' => 0]);
//
//         $studentsInMap = [];
//         $studentsNotInMap = [];
//         // Asignar estudiantes a celdas aleatorias pero maximo 4 estudiantes
//         $students = $randomizedStudents->take(4);
//         foreach ($students as $index => $student) {
//             $randomRow = rand(2, 6);
//             $randomCol = rand(1, 8);
//             $cell = $map->cells()
//                 ->where('posicion_x', $randomCol)
//                 ->where('posicion_y', $randomRow)
//                 ->first();
//             if ($cell) {
//                 $cell->content = $student->name;
//                 $cell->save();
//                 $studentsInMap[] = $student->name;
//             } else {
//                 $studentsNotInMap[] = $student->name;
//             }
//         }
//
//         return response()->json(['message' => 'Usuarios insertados', 'studentsInMap' => $studentsInMap, 'studentsNotInMap' => $studentsNotInMap], 200);
//     }
//
//
//
//
//    public function moveAllUsers($second)
//    {
//        $adjacentPositions = [
//            ['x' => -1, 'y' => 0],
//            ['x' => 1, 'y' => 0],
//            ['x' => 0, 'y' => -1],
//            ['x' => 0, 'y' => 1]
//        ];
//
//        $map = Map::find(1);
//        $movedUsers = [];
//
//        $cells = $map->cells()->whereNotNull('content')->get();
//
//        foreach ($cells as $cell) {
//            if (in_array($cell->content, $movedUsers)) {
//                continue;
//            }
//
//            $cell->second_content = $second;
//
//            foreach ($adjacentPositions as $position) {
//                $newX = $cell->posicion_x + $position['x'];
//                $newY = $cell->posicion_y + $position['y'];
//
//                // Ensure the new position is within the map boundaries
//                if ($newX > 0 && $newX <= 8 && $newY > 0 && $newY <= 7) {
//                    $newCell = $map->cells()
//                        ->where('posicion_x', $newX)
//                        ->where('posicion_y', $newY)
//                        ->first();
//
//                    if ($newCell && !$newCell->content) {
//                        $newCell->content = $cell->content;
//                        $newCell->save();
//                        $movedUsers[] = $cell->content;
//                        $cell->content = null; // Clear the previous cell
//                        $cell->save();
//                        break;
//                    }
//                }
//            }
//        }
//
//        return response()->json(['message' => 'Usuarios movidos', 'map' => $map], 200);
//    }
//
//    public function cleanMap($id)
//    {
//        $map = Map::find($id);
//        //quiero que se limpie el mapa exceptuando las puertas y las paredes
//          $cells = $map->cells()->where('content', '!=', 'PUERTA')->where('content', '!=', 'XXXX')->update(['content' => null]);
//
//             return response()->json(['message' => 'Mapa limpiado'], 200);
//
//    }


//
// public function insertUsers($id, $second)
// {
//     $students = DB::table('users as u')
//         ->select('u.name')
//         ->join('role_user as ru', 'u.id', '=', 'ru.user_id')
//         ->join('roles as r', 'ru.role_id', '=', 'r.id')
//         ->where('r.name', '=', 'student')
//         ->inRandomOrder()
//         ->get();
//     $map = Map::find($id);
//
//     // Insertar las 56 celdas de nuevo
//     for ($y = 1; $y <= 7; $y++) {
//         for ($x = 1; $x <= 8; $x++) {
//             DB::table('cells')->insert([
//                 'map_id' => $id,
//                 'posicion_x' => $x,
//                 'posicion_y' => $y,
//                 'content' => null,
//                 'second_content' => $second
//             ]);
//         }
//     }
//
//     // Asignar estudiantes a celdas aleatorias
//     $students = $students->random(rand(0, 4));
//     foreach ($students as $index => $student) {
//         $randomRow = rand(2, 6);
//         $randomCol = rand(1, 8);
//         $cell = $map->cells()
//             ->where('posicion_x', $randomCol)
//             ->where('posicion_y', $randomRow)
//             ->first();
//         if ($cell) {
//             $cell->content = $student->name;
//             $cell->save();
//         }
//     }
//
//     return $
// }



}
