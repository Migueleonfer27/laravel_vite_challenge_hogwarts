<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

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
