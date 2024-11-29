<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Map;
use App\Models\Cell;

class MapSeeder extends Seeder
{
    public function run()
    {

        $map = Map::create([
            'name' => 'Mapa Merodeador',
        ]);

        for ($y = 1; $y <= 7; $y++) {
            for ($x = 1; $x <= 8; $x++) {
                Cell::create([
                    'map_id' => $map->id,
                    'posicion_x' => $x,
                    'posicion_y' => $y,
                    'content' => null,
                    'second_content' => null,
                ]);
            }
        }
    }
}
