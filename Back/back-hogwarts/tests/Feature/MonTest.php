<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Spell;

class MonTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_teacherAproveSpell()
    {
        $user = User::where('email', 'snape@hogwarts.com')->first();

        $this->assertNotNull($user, 'Test user does not exist in the database.');

        $spell = Spell::factory()->create([
            'validation_status' => 'pending',
        ]);

        // Act as the authenticated user
        $this->actingAs($user);

        // Make the request
        $response = $this->postJson("/api/spells/{$spell->id}/approve-teacher");

        // Assert the response
        $response->assertStatus(200)
                 ->assertJson([
                   'success' => true,
                   'message' => 'Spell approved successfully',
                 ]);
    }
public test_spellDoesntExist()
    {
        // Use an existing user
        $user = User::where('email', 'snape@hogwarts.com')->first();

        // Ensure the user exists
        $this->assertNotNull($user, 'Test user does not exist in the database.');

        // Act as the authenticated user
        $this->actingAs($user);

        // Make the request with a non-existing spell ID
        $response = $this->postJson('/api/spells/approve/999');

        // Assert the response
        $response->assertStatus(404)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Spell not found',
                 ]);
    }

}
