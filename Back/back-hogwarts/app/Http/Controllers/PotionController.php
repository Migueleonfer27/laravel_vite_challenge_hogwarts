<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Potion;
use App\Models\User;
use Illuminate\Http\Request;

// Miguel León Fernández
class PotionController extends Controller
{
    public function index()
    {
        try {
            $potions = Potion::with('user:id,name')->get();
            if ($potions->isEmpty()) {
                return response()->json([
                   'success' => false,
                   'message' => 'No potions found',
                ], 404);
            }
            return response()->json([
                'success' => true,
                'message' => 'List all Potion',
                'potions' => $potions->load('ingredients')
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while trying to fetch the potions.',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255|unique:potions',
                'description' => 'required|string|max:255',
                'creator' => 'required|string|exists:users,name',
                'ingredients' => 'required|array',
                'ingredients.*' => 'exists:ingredients,id',
            ]);

            $creatorId = User::where('name', $validatedData['creator'])->value('id');

            if (!$creatorId) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró un usuario con ese nombre.'
                ], 404);
            }

            $potion = Potion::create([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'creator' => $creatorId,
            ]);

            $potion->ingredients()->attach($validatedData['ingredients']);
            [$goodLevel, $badLevel] = $this->calculateLevels($validatedData['ingredients']);
            $potion->update(['good_level' => $goodLevel, 'bad_level' => $badLevel]);

            return response()->json([
                'success' => true,
                'message' => 'Potion created successfully.',
                'potion' => $potion
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while trying to create the potion.',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $potion = Potion::find($id);
            if (!$potion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Potion not found',
                ], 404);
            }
            return response()->json([
                'success' => true,
                'potion' => $potion
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Potion not found.',
                'error' => $th->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'sometimes|string|max:255|unique:potions,name,' . $id,
                'description' => 'sometimes|string|max:255',
                'ingredients' => 'array|required',
                'ingredients.*' => 'exists:ingredients,id',
            ]);

            $potion = Potion::find($id);

            if (!$potion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Potion not found',
                ]);
            }

            if ($request->has('name')) {
                $potion->name = $validatedData['name'];
                $potion->description = $validatedData['description'];
            }

            if ($request->has('ingredients')) {
                $potion->ingredients()->sync($validatedData['ingredients']);
                [$goodLevel, $badLevel] = $this->calculateLevels($validatedData['ingredients']);
                $potion->good_level = $goodLevel;
                $potion->bad_level = $badLevel;
            }

            $potion->approves_teacher = false;
            $potion->approves_dumbledore = false;
            $potion->save();

            return response()->json([
                'success' => true,
                'message' => 'Potion updated successfully',
                'potion' => $potion->load('ingredients')
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating potion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $potion = Potion::find($id);
            if (!$potion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Potion not found',
                ], 404);
            }
            $potion->delete();
            return response()->json([
                'success' => true,
                'message' => 'Potion deleted successfully.'
            ], 200);
        }catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the potion.',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    private function calculateLevels(array $ingredientIds)
    {
        $goodLevel = 0;
        $badLevel = 0;

        $ingredients = Ingredient::find($ingredientIds);

        foreach ($ingredients as $ingredient) {
            $goodLevel += $ingredient->healing + $ingredient->curative + $ingredient->deinflammatory;
            $badLevel += $ingredient->poisoning + $ingredient->pain + $ingredient->sickening + $ingredient->inflammatory;
        }

        $ingredientCount = $ingredients->count();
        $goodLevel = $ingredientCount > 0 ? round($goodLevel / $ingredientCount) : 0;
        $badLevel = $ingredientCount > 0 ? round($badLevel / $ingredientCount) : 0;

        return [$goodLevel, $badLevel];
    }
}
