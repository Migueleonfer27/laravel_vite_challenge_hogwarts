<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Role;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array{
        $roles =['admin','teacher','student'];
        $roleName = $this->faker->unique()->randomElement(array_merge($roles,['dumbledore']));

        if($roleName == 'dumbledore' && Role::where('name','dumbledore')->exists()){
            $roleName = $this->faker->randomElement($roles);
        }
        return [
            'name' => $roleName,
        ];
    }
}
