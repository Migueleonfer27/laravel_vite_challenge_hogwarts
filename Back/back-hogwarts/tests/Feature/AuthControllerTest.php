<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\House;
use App\Models\Role;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    // Miguel León Fernández
    /** @test */
    public function register_new_user_test()
    {
        House::create(['name' => 'Gryffindor']);
        House::create(['name' => 'Hufflepuff']);
        House::create(['name' => 'Ravenclaw']);
        House::create(['name' => 'Slytherin']);
        Role::create(['name' => 'student']);

        $data = [
            'name' => 'Fernando',
            'email' => 'fernando@gmail.com',
            'password' => '123456',
            'confirm_password' => '123456',
            'housePreferences' => ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'],
            'noPreference' => false,
        ];

        $response = $this->postJson(route('register'), $data);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Usuario registrado con éxito.',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => $data['email'],
        ]);
    }

    // Miguel León Fernández
    /** @test */
    public function login_user_test()
    {
        $house = House::create(['name' => 'Gryffindor']);

        $user = User::factory()->create([
            'email' => 'inma@gmail.com',
            'password' => bcrypt('123456'),
            'name' => 'Inma',
            'level' => 1,
            'experience' => 0,
            'id_house' => $house->id,
        ]);

        $data = [
            'email' => 'inma@gmail.com',
            'password' => '123456',
        ];

        $response = $this->postJson(route('login'), $data);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Usuario logueado correctamente.',
            ])
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'name',
                    'roles',
                    'house',
                    'level',
                ],
            ]);
    }

    // Miguel León Fernández
    /** @test */
    public function login_user_wrong_credentials_test()
    {
        $data = [
            'email' => 'error@gmail.com',
            'password' => '1234567',
        ];

        $response = $this->postJson(route('login'), $data);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'errors' => [
                    'general' => ['Credenciales incorrectas. Verifica tu correo y contraseña.']
                ],
            ]);
    }

    // Miguel León Fernández
    /** @test */
    public function logout_user_test()
    {
        $house = House::factory()->create(['name' => 'Gryffindor']);

        $user = User::factory()->create([
            'level' => 1,
            'experience' => 0,
            'id_house' => $house->id,
        ]);

        $token = $user->createToken('auth_token', ['student'])->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token"
        ])->postJson(route('logout'));

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'You have been logged out!',
            ]);

        $this->assertCount(0, $user->tokens);
    }
}
