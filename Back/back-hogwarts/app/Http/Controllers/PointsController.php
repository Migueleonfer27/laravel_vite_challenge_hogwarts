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
    //Monica
    public function spellValidatedPoints($id){
        $spell = Spell::find($id);
        $user = $spell->user;
        $house = $user->house;

        if($user->hasRole('teacher')){
            $user->experience += 10;
            $this->updateUserLevel($user);
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
            $this->updateUserLevel($user);
            $house->points += 1;
            $house->save();
            $user->save();
            return response()->json([
                'success' => true,
                'message' => 'Puntos de experiencia sumados correctamente.',
                'data' => $user
            ], 200);
        }else{
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para realizar esta acción.'
            ], 403);
        }

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


    //Cynthia
    public function addPointsDuels()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado.'
            ], 401);
        }

        if (!$user->house) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes una casa asignada'
            ], 400);
        }

        $user->experience += 2;
        $this->updateUserLevel($user);

        $user->house->points += 3;
        $user->house->save();
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Has ganado el duelo',
            'data' => [
                'experience' => $user->experience,
                'level' => $user->level,
                'house_points' => $user->house->points
            ]
        ], 200);
    }



}
