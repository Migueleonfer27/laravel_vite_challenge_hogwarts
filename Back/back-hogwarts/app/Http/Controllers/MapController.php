<?php

namespace App\Http\Controllers;

use App\Models\Map;
use App\Models\Cell;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MapController extends Controller
{
    public function createMap(Request $request)
    {

        $map = Map::create(['name' => $request->input('name', 'MapaMerodeador')]);//por si no se pone nombre se queda por defecto

        for ($y = 1; $y <= 7; $y++) {
            for ($x = 1; $x <= 8; $x++) {
                Cell::create([
                    'map_id' => $map->id,
                    'posicion_x' => $x,
                    'posicion_y' => $y,
                    'content' => null,
                ]);
            }
        }

        return response()->json(['message' => 'Mapa creado exitosamente', 'map' => $map], 201);
    }

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

    public function updateUsers()
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

        // Colocar de 0 a 4 estudiantes en el mapa
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
