<?php

namespace App\Http\Controllers;

use App\Models\Duel;
use App\Models\Spell;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class DuelsController extends Controller
{

    //Sacar los duelos
    public function index()
    {
        $duels = Duel::all();

        if ($duels->isEmpty()) {
            return response()->json('Not found subjects', 404);
        }
        return response()->json($duels, 200);
    }

    //Sacar los duelos de un id
    public function show($id){
        $duels = Duel::find($id);

        if (!$duels) {
            return response()->json('Not found subject', 404);
        }
        return response()->json($duels, 200);
    }

    public function duels(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json('Unauthorized', 401);
        }
        $userSpells = $user->spells->filter(function ($spell) {
            return $spell->level <= $user->level && $spell->is_approved;
        });

        if ($userSpells->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No se han encontrado hechizos disponibles para tu nivel'
            ], 400);
        }

        $selectedSpellId = $request->input('spell_id');
        $selectedSpell = $userSpells->find($selectedSpellId);

        if (!$selectedSpell) {
            return response()->json([
                'success' => false,
                'message' => 'No se ha encontrado el hechizo seleccionado'
            ], 400);
        }
    return response()->json($selectedSpell, 200);
    }
}
