<?php

namespace Database\Factories;

use App\Models\House;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\House>
 */
class HouseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array{

        $houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw','Slytherin'];
        $houseName = $this->faker->unique()->randomElement($houses);

        if(House::where('name', $houseName)->exists()){
            $houseName = $this->faker->unique()->randomElement(array_diff($houseName, [$houseName]));
        }
        return [
            'name' => $houseName,
            'points' => 0
        ];
    }
}
