<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HouseController extends Controller
{
    public function index() {
        $user = Auth::user();
        $house = $user->house;

        if (!$house) {
            return response()->json([
                'success' => false,
                'message' => 'The user do not have a house'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'house' => $house->name
        ], 200);
    }

    public function sortingHat(Request $request)
    {
        $validated = $request->validate([
            'housePreferences' => 'nullable|array',
            'noPreference' => 'nullable|boolean',
        ]);

        $chosenHouse = null;

        if (!$validated['noPreference']) {
            $houses = ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'];
            $chosenHouse = $houses[array_rand($houses)];
        } else {
            $preferences = $validated['housePreferences'];
            $randomNumber = mt_rand(1, 10);

            switch (true) {
                case ($randomNumber <= 4):
                    $chosenHouse = $preferences[0];
                    break;
                case ($randomNumber >= 5 && $randomNumber <= 7):
                    $chosenHouse = $preferences[1];
                    break;
                case ($randomNumber >= 8 && $randomNumber <= 9):
                    $chosenHouse = $preferences[2];
                    break;
                case ($randomNumber == 10):
                    $chosenHouse = $preferences[3];
                    break;
            }
        }

        return $chosenHouse;
    }
}
