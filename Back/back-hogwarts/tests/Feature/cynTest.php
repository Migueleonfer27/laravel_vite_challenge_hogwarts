<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Duel;
use App\Models\House;
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

    public function test_get_duel_statistics_with_duels()
    {

        $house = House::create([
            'name' => 'Gryffindor'
        ]);

        $user = User::factory()->create([
            'id_house' => $house->id
        ]);
        $this->actingAs($user);

        Duel::create(['user_id' => $user->id, 'result' => 1]);
        Duel::create(['user_id' => $user->id, 'result' => 2]);
        Duel::create(['user_id' => $user->id, 'result' => 0]);

        $response = $this->getJson('/api/duel/statistics');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'statistics' => [
                    'total_duels' => 3,
                    'won_duels' => 1,
                    'lost_duels' => 1,
                    'active_duels' => 1,
                ]
            ]);
    }
}
