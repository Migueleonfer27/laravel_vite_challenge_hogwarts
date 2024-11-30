<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HouseController extends Controller
{
    // Miguel León Fernández
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

    // Miguel León Fernández
    public function sortingHat(Request $request)
    {
        $validated = $request->validate([
            'housePreferences' => 'nullable|array',
            'noPreference' => 'nullable|boolean',
        ]);

        $chosenHouse = null;
        $randomNumber = mt_rand(1, 10);

        if (!$validated['noPreference']) {
            $houseCounts = [
                'gryffindor' => User::where('id_house', 1)->count(),
                'hufflepuff' => User::where('id_house', 2)->count(),
                'ravenclaw' => User::where('id_house', 3)->count(),
                'slytherin' => User::where('id_house', 4)->count(),
            ];

            asort($houseCounts);
            $sortedHouses = array_keys($houseCounts);

            $chosenHouse = $this->getHouse($randomNumber, $sortedHouses, $chosenHouse);
        } else {
            $preferences = $validated['housePreferences'];

            if (count($preferences) < 4) {
                return response()->json([
                    'success' => false,
                    'message' => 'House preferences must contain at least 4 options.'
                ], 422);
            }

            $chosenHouse = $this->getHouse($randomNumber, $preferences, $chosenHouse);
        }

        return $chosenHouse;
    }

    // Miguel León Fernández
    public function getHouse($randomNumber, $sortedHouses, $chosenHouse)
    {
        switch (true) {
            case ($randomNumber <= 4):
                $chosenHouse = $sortedHouses[0];
                break;
            case ($randomNumber >= 5 && $randomNumber <= 7):
                $chosenHouse = $sortedHouses[1];
                break;
            case ($randomNumber >= 8 && $randomNumber <= 9):
                $chosenHouse = $sortedHouses[2];
                break;
            case ($randomNumber == 10):
                $chosenHouse = $sortedHouses[3];
                break;
        }
        return $chosenHouse;
    }
}
