<?php

namespace App\Http\Controllers;

use App\Models\User;
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
        $randomNumber = mt_rand(1, 10);

        if (!$validated['noPreference']) {
            $houseCounts = [
                1 => User::where('house_id', 1)->count(),
                2 => User::where('house_id', 2)->count(),
                3 => User::where('house_id', 3)->count(),
                4 => User::where('house_id', 4)->count(),
            ];

            asort($houseCounts);
            $sortedHouses = array_keys($houseCounts);
            $chosenHouse = $this->chooseHouse($sortedHouses, $randomNumber);
        } else {
            $preferences = $validated['housePreferences'];

            if (count($preferences) < 4) {
                return response()->json([
                    'success' => false,
                    'message' => 'House preferences must contain at least 4 options.'
                ], 422);
            }

            $chosenHouse = $this->chooseHouse($preferences, $randomNumber);
        }

        return $chosenHouse;
    }

    private function chooseHouse($options, $randomNumber)
    {
        switch (true) {
            case ($randomNumber <= 4):
                return $options[0];
            case ($randomNumber >= 5 && $randomNumber <= 7):
                return $options[1];
            case ($randomNumber >= 8 && $randomNumber <= 9):
                return $options[2];
            case ($randomNumber == 10):
                return $options[3];
        }

        return null;
    }
}
