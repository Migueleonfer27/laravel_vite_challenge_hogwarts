<?php

namespace Database\Seeders;

use App\Models\House;
use App\Models\Spell;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            HouseSeeder::class,
            UserSeeder::class,
            SubjectSeeder::class,
            IngredientSeeder::class,
            SpellSeeder::class,
            MapSeeder::class,
        ]);
    }
}
