<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void{
        $ingredients = [
            'Aguijón de Lución' => [
                'healing' => 70,
                'poisoning' => 0,
                'analgesic' => 90,
                'pain' => 0,
                'curative' => 20,
                'sickening' => 0,
                'inflammatory' => 0,
                'Deinflammatory' => 10,
            ],
            'Hígado de drágon' => [
                'healing' => 0,
                'poisoning' => 80,
                'analgesic' => 0,
                'pain' => 60,
                'curative' => 0,
                'sickening' => 90,
                'inflammatory' => 70,
                'Deinflammatory' => 0,
            ],
            'Babosa cornuda' => [
                'healing' => 50,
                'poisoning' => 0,
                'analgesic' => 90,
                'pain' => 0,
                'curative' => 10,
                'sickening' => 0,
                'inflammatory' => 0,
                'Deinflammatory' => 0,
            ],
            'Ojo de tritón' => [
                'healing' => 0,
                'poisoning' => 0,
                'analgesic' => 0,
                'pain' => 100,
                'curative' => 0,
                'sickening' => 90,
                'inflammatory' => 90,
                'Deinflammatory' => 0,
            ],
        ];

        foreach ($ingredients as $name => $values) {
            Ingredient::create(array_merge(['name' => $name], $values));
        }


    }
}
