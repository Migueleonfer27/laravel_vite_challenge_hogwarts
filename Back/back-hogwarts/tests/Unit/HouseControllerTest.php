<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\HouseController;

class HouseControllerTest extends TestCase
{
    // Miguel León Fernández
    /** @test */
    public function test_pick_random_house()
    {
        $controller = new HouseController();
        $sortedHouses = ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'];
        $this->assertEquals('gryffindor', $controller->getHouse(1, $sortedHouses, null));
        $this->assertEquals('gryffindor', $controller->getHouse(4, $sortedHouses, null));
        $this->assertEquals('hufflepuff', $controller->getHouse(5, $sortedHouses, null));
        $this->assertEquals('hufflepuff', $controller->getHouse(7, $sortedHouses, null));
        $this->assertEquals('ravenclaw', $controller->getHouse(8, $sortedHouses, null));
        $this->assertEquals('ravenclaw', $controller->getHouse(9, $sortedHouses, null));
        $this->assertEquals('slytherin', $controller->getHouse(10, $sortedHouses, null));
    }
}
