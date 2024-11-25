<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class UserSpellController extends Controller
{
    public function store($id)
    {
        $userId = Auth::user();

        DB::table('user_spell')->insert([
            'user_id' => $userId->id,
            'spell_id' => $id,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['success' => true, 'message' => 'Data inserted successfully']);
    }
}
