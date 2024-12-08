<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Spell;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Spell>
 */

class SpellFactory extends Factory
{
    protected $model = Spell::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'attack' => $this->faker->numberBetween(1, 100),
            'defense' => $this->faker->numberBetween(1, 100),
            'healing' => $this->faker->numberBetween(1, 100),
            'damage' => $this->faker->numberBetween(1, 100),
            'summon' => $this->faker->numberBetween(1, 100),
            'action' => $this->faker->numberBetween(1, 100),
            'level' => $this->faker->numberBetween(1, 10),
            'validation_status' => 'pending',
            'creator' => User::factory(),
        ];
    }
}
