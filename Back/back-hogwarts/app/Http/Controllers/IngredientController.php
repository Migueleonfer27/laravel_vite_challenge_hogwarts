<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    public function index()
    {
        try {
            $ingredients = Ingredient::all();
            return response()->json([
                'success' => true,
                'message' => 'Ingredients List',
                'ingredients' => $ingredients
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while trying to fetch the ingredients.',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255|unique:ingredients',
                'healing' => 'required|integer|between:0,100',
                'poisoning' => 'required|integer|between:0,100',
                'analgesic' => 'required|integer|between:0,100',
                'pain' => 'required|integer|between:0,100',
                'curative' => 'required|integer|between:0,100',
                'sickening' => 'required|integer|between:0,100',
                'inflammatory' => 'required|integer|between:0,100',
                'deinflammatory' => 'required|integer|between:0,100',
                'url_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('ingredients', 'public');
            } else {
                $photoPath = null;
            }

            $ingredient = Ingredient::create([
                'name' => $validatedData['name'],
                'healing' => $validatedData['healing'],
                'poisoning' => $validatedData['poisoning'],
                'analgesic' => $validatedData['analgesic'],
                'pain' => $validatedData['pain'],
                'curative' => $validatedData['curative'],
                'sickening' => $validatedData['sickening'],
                'inflammatory' => $validatedData['inflammatory'],
                'deinflammatory' => $validatedData['deinflammatory'],
                'photo' => $photoPath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Ingredient created successfully.',
                'ingredient' => $ingredient,
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while trying to store the ingredient.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $ingredient = Ingredient::find($id);

            if (!$ingredient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ingredient not found.',
                ], 404);
            }

            $ingredient->delete();

            return response()->json([
                'success' => true,
                'message' => 'Ingredient deleted successfully.',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while trying to delete the ingredient.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
