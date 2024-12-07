<?php

namespace Tests\Unit;

use Tests\TestCase; // Usar la clase TestCase de Laravel
use Illuminate\Foundation\Testing\RefreshDatabase;

class cynTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic unit test example.
     */
    public function test_example(): void
    {
        $this->assertTrue(true);
    }

    public function test_create_duel_unauthenticated_user()
    {
        $response = $this->postJson('/api/duels/create');
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
