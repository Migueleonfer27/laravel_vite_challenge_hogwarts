<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Spell;

class MonTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */

    public function test_teacherAproveSpell()
    {
        $user = User::where('email', 'snape@hogwarts.com')->first();//no se por que no me coge el usuario de la bbdd

        $this->assertNotNull($user, 'Test user does not exist in the database.');

        $spell = Spell::factory()->create([
            'validation_status' => 'pending',
        ]);

        $this->actingAs($user);

        $response = $this->postJson("/api/spells/{$spell->id}/approve-teacher");

        $response->assertStatus(200)
                 ->assertJson([
                   'success' => true,
                   'message' => 'Spell approved successfully',
                 ]);
    }

     public function test_spellDoesntExist()
        {

            $user = User::where('email', 'snape@hogwarts.com')->first();

            $this->assertNotNull($user, 'Test user does not exist in the database.');

            $this->actingAs($user);

            $response = $this->postJson('/api/spells/approve/999');

            $response->assertStatus(404)
                     ->assertJson([
                         'success' => false,
                         'message' => 'Spell not found',
                     ]);
        }
    }
