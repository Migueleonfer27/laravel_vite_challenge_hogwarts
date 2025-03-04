<?php

namespace Database\Seeders;

use App\Models\Spell;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpellSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void{

        $spells = [
            'Accio' => [
                'attack' => 0,
                'defense' => 0,
                'healing' => 0,
                'damage' => 0,
                'summon' => 0,
                'action'=> 100,
                'creator' => null,
                'level' => 1,
                'validation_status' => 'approved by dumbledore',
            ],
            'Cofringo' => [
                'attack' => 70,
                'defense' => 0,
                'healing' => 0,
                'damage' => 60,
                'summon' => 0,
                'action'=> 70,
                'creator' => null,
                'level' => 2,
                'validation_status' => 'approved by dumbledore',
            ],
            'Expelliarmus' => [
                'attack' => 50,
                'defense' => 50,
                'healing' => 0,
                'damage' => 10,
                'summon' => 0,
                'action'=> 90,
                'creator' => null,
                'level' => 1,
                'validation_status' => 'approved by dumbledore',
            ],
            'Lumos' => [
                'attack' => 0,
                'defense' => 0,
                'healing' => 0,
                'damage' => 0,
                'summon' => 100,
                'action'=> 90,
                'creator' => null,
                'level' => 1,
                'validation_status' => 'approved by dumbledore',
            ],
            'Expulso' => [
                'attack' => 80,
                'defense' => 0,
                'healing' => 0,
                'damage' => 80,
                'summon' => 0,
                'action'=> 20,
                'creator' => null,
                'level' => 3,
                'validation_status' => 'approved by dumbledore',
            ],
            'Riddikulus' => [
                'attack' => 0,
                'defense' => 40,
                'healing' => 0,
                'damage' => 0,
                'summon' => 0,
                'action'=> 40,
                'creator' => null,
                'level' => 2,
                'validation_status' => 'approved by dumbledore',
            ],
            'Demaius' => [
                'attack' => 80,
                'defense' => 0,
                'healing' => 0,
                'damage' => 20,
                'summon' => 0,
                'action'=> 60,
                'creator' => null,
                'level' => 3,
                'validation_status' => 'approved by dumbledore',
            ],
            'Expectro patronus' => [
                'attack' => 0,
                'defense' => 90,
                'healing' => 0,
                'damage' => 0,
                'summon' => 100,
                'action'=> 70,
                'creator' => null,
                'level' => 2,
                'validation_status' => 'approved by dumbledore',
            ],
            'Confundo' => [
                'attack' => 60,
                'defense' => 30,
                'healing' => 0,
                'damage' => 10,
                'summon' => 0,
                'action'=> 10,
                'creator' => null,
                'level' => 2,
                'validation_status' => 'approved by dumbledore',
            ],
            'Reparo' => [
                'attack' => 0,
                'defense' => 0,
                'healing' => 80,
                'damage' => 0,
                'summon' => 0,
                'action'=> 100,
                'creator' => null,
                'level' => 2,
                'validation_status' => 'approved by dumbledore',
            ],
            'Imperio' => [
                'attack' => 70,
                'defense' => 30,
                'healing' => 0,
                'damage' => 20,
                'summon' => 0,
                'action'=> 100,
                'creator' => null,
                'level' => 4,
                'validation_status' => 'approved by dumbledore',
            ],
            'Crucio' => [
                'attack' => 100,
                'defense' => 40,
                'healing' => 0,
                'damage' => 100,
                'summon' => 0,
                'action'=> 100,
                'creator' => null,
                'level' => 4,
                'validation_status' => 'approved by dumbledore',
            ],
            'Avada Kedavra' => [
                'attack' => 100,
                'defense' => 100,
                'healing' => 0,
                'damage' => 100,
                'summon' => 0,
                'action'=> 100,
                'creator' => null,
                'level' => 5,
                'validation_status' => 'approved by dumbledore',
            ],
        ];

        foreach ($spells as $name => $values) {
            Spell::create(array_merge(['name' => $name], $values));
        }


    }
}
