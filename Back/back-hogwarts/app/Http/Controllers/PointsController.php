<?php

namespace App\Http\Controllers;

use App\Models\Potion;
use App\Models\User;
use App\Models\House;
use App\Models\Spell;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Mockery\Exception;

class PointsController extends Controller
{
    // Miguel León Fernández
    public function approvePotion(Request $request, $potionId)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Unauthorized.'
                ], 401);
            }

            if (!$user->hasRole('teacher') && !$user->hasRole('dumbledore')) {
                return response()->json([
                    'success' => false,
                    'error' => 'You do not have permission to approve potions.'
                ], 403);
            }

            $potion = Potion::find($potionId);
            $creator = $potion->user;

            if (!$creator) {
                return response()->json([
                    'success' => false,
                    'error' => 'Creator not found.'
                ], 404);
            }

            if ($user->hasRole('teacher')) {
                $potion->approves_teacher = true;
                $creator->experience += 2;
            }

            if ($user->hasRole('dumbledore')) {
                $potion->approves_dumbledore = true;
                $creator->experience += 2;

                if ($creator->house) {
                    $creator->house->points += 2;
                    $creator->house->save();
                }
            }

            $this->updateUserLevel($creator);
            $potion->save();
            $creator->save();

            return response()->json([
                'success' => true,
                'message' => 'Potion approved successfully.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Miguel León Fernández
    private function updateUserLevel($user)
    {
        $experience = $user->experience;

        if ($experience > 500) {
            $user->level = 5;
        } elseif ($experience > 300) {
            $user->level = 4;
        } elseif ($experience > 150) {
            $user->level = 3;
        } elseif ($experience > 50) {
            $user->level = 2;
        } else {
            $user->level = 1;
        }
    }

    //Monica
    public function spellValidatedPoints($id){
        $spell = Spell::find($id);
        $user = $spell->user;
        $house = $user->house;

        if($user->hasRole('teacher')){
            $user->experience += 10;
            $house->points += 2;
            $house->save();
            $user->save();
            return response()->json([
                'success' => true,
                'message' => 'Puntos de experiencia sumados correctamente.',
                'data' => $user
            ], 200);
        }elseif($user->hasRole('student')) {
            $user->experience += 2;
            $house->points += 1;
            $house->save();
            $user->save();
            return response()->json([
                'success' => true,
                'message' => 'Puntos de experiencia sumados correctamente.',
                'data' => $user
            ], 200);
        }

    }

    public function addExperience(Request $request, $id) {
        $user = User::findOrFail($id);
        $user->experience += $request->input('experience');
        $user->updateLevelBasedExperience();

        return response()->json([
            'success' => true,
            'message' => 'Experiencia actualizada correctamente.',
            'data'=>$user
        ],200);
    }

    public function addPointsTeacherSpell(Request $request){
        $user = Auth::user();

        if (!$user || $user->name !== 'Dumbledore') {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar esta acción. Solo Dumbledore puede agregar puntos.'
            ], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $targetUser = User::find($validated['user_id']);

        if (!$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario al que se le van a sumar los puntos no existe.'
            ], 404);
        }

        if (!$targetUser->hasRole('teacher')) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario seleccionado no es un profesor.'
            ], 400);
        }

        $targetUser->addExperienceTeacherSpell();

        return response()->json([
            'success' => true,
            'message' => 'Se han sumado los puntos de experiencia al profesor.',
            'user' => $targetUser
        ], 200);
    }

    public function addPointsStudentPotion(Request $request){
        $user = Auth::user();

        if (!$user || !$user->hasRole('dumbledore')) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar esta acción.'
            ], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $targetUser = User::find($validated['user_id']);

        if (!$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'El estudiante al que se le van a sumar los puntos no existe.'
            ], 404);
        }

        if (!$targetUser->hasRole('student')) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario seleccionado no es un estudiante.'
            ], 400);
        }

        $targetUser->addExperienceStudentPotion();

        return response()->json([
            'success' => true,
            'message' => 'Se han sumado 2 puntos de experiencia al estudiante.',
            'user' => $targetUser
        ], 200);
    }

    public function addPointsStudentSpell(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole('dumbledore')) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar esta acción.'
            ], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $targetUser = User::find($validated['user_id']);

        if (!$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'El estudiante al que se le van a sumar los puntos no existe.'
            ], 404);
        }

        if (!$targetUser->hasRole('student')) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario seleccionado no es un estudiante.'
            ], 400);
        }

        $targetUser->addExperienceStudentSpell();

        return response()->json([
            'success' => true,
            'message' => 'Se han sumado 2 puntos de experiencia y 1 punto a la casa del estudiante.',
            'user' => $targetUser
        ], 200);
    }

    public function profile(){
        $user = Auth::user();
        $house = $user->house;
        $subjects = $user->subjects;

        return response()->json([
            'success' => true,
            'data'=>[
                'name' => $user->name,
                'email' => $user->email,
                'level' => $user ->level,
                'experience' => $user->experience,
                'url_photo' => $user->url_photo,
                'house' => [
                    'name' => $house->name,
                    'points' => $house->points,
                ],
                'subjects' => $subjects->pluck('name'), ///Funcion laravel
            ]
        ]);
    }

    public function updateLevelBasedOnExperience() :void{
        if($this -> experience >= 0 && $this -> experience <= 49){
            $this -> level = 1;
        }elseif ($this -> experience >= 50 && $this -> experience <= 149){
            $this -> level = 2;
        }elseif ($this -> experience >= 150 && $this -> experience <= 299){
            $this -> level = 3;
        }elseif ($this -> experience >= 300 && $this -> experience <= 499){
            $this -> level = 4;
        }elseif ($this -> experience >= 500){
            $this -> level = 5;
        }

        if($this -> isDirty('level')){
            $this->save();
        }
    }

    public function addExperienceTeacherSpell(){
        $this->experience += 10;

        $house = $this->house;

        if ($house) {
            $house->points += 2;
            $house->save();
        }

        $this->save();
    }

    public function addExperienceStudentPotion(){
        if ($this->hasRole('student') && $this->subjects->contains('name', 'pócimas')) {
            $this->experience += 2;
            $this->save();
        }
    }

    public function addExperienceStudentSpell(){
        if ($this->hasRole('student') && $this->subjects->contains('name', 'hechizos')) {
            $this->experience += 2;

            if ($this->house) {
                $this->house->points += 1;
                $this->house->save();
            }

            $this->save();
        }
    }
}
