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
        $map = Map::with('cells')->findOrFail($id);

        $grid = [];
        foreach ($map->cells as $cell) {
            $grid[$cell->y][$cell->x] = $cell->content ?? '-';
        }

        return response()->json(['map' => $map, 'grid' => $grid]);
    }

    public function deleteCells()
    {
        $cells = DB::table('cells')->update(['content' => null]);
        return response()->json(['message' => 'Celdas vaciadas'], 200);
    }



    public function moveAllUsers()
        {
            $allPositions = [
                ['x' => -1, 'y' => 0],
                ['x' => 1, 'y' => 0],
                ['x' => 0, 'y' => -1],
                ['x' => 0, 'y' => 1],
            ];

            shuffle($allPositions);
            $adjacentPositions = $allPositions;


            $users = DB::table('users')->get();
            $map = Map::find(1);

            foreach ($users as $user) {
                $cell = $map->cells()->where('content', $user->name)->first();

                if ($cell) {
                    foreach ($adjacentPositions as $position) {
                        $newCell = $map->cells()
                            ->where('posicion_x', $cell->posicion_x + $position['x'])
                            ->where('posicion_y', $cell->posicion_y + $position['y'])
                            ->first();

                        if ($newCell && !$newCell->content) {
                            $newCell->content = $user->name;
                            $newCell->save();

                            $cell->content = null;
                            $cell->save();
                            break;
                        }
                    }
                }
            }

            return response()->json(['message' => 'Usuarios movidos', 'map' => $map], 200);
        }



    public function insertUsers()
    {
        $students = DB::table('users as u')
            ->select('u.name')
            ->join('role_user as ru', 'u.id', '=', 'ru.user_id')
            ->join('roles as r', 'ru.role_id', '=', 'r.id')
            ->where('r.name', '=', 'student')
            ->inRandomOrder()
            ->get();
        $map = Map::find(1);
        $this->deleteCells();

        $students = $students->random(rand(0, 4));
        foreach ($students as $index => $student) {
            $randomRow = rand(2, 6);
            $randomCol = rand(1, 8);
            $cell = $map->cells()
                ->where('posicion_x', $randomCol)
                ->where('posicion_y', $randomRow)
                ->first();
            if ($cell) {
                $cell->content = $student->name;
                $cell->save();
            }
        }

        return response()->json(['message' => 'Usuarios actualizados en el mapa', 'map' => $map], 200);
    }



}
