<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Subject;
use Illuminate\Support\Facades\Validator;


class SubjectController extends Controller{
    //Cynthia

    public function index(){
        $subjects = Subject::all();

        if($subjects->isEmpty()){
            return response()->json('Not found subjects', 404);
        }
        return response()->json($subjects, 200);
    }

    public function show($id){
        $subject = Subject::find($id);

        if(!$subject){
            return response()->json('Not found subject', 404);
        }
        return response()->json($subject, 200);
    }

    public function create (Request $request){
        $input = $request->all();
        $rules = [
            'name' => 'required|string|unique:subjects',
        ];

        $messages = [
            'required' => 'The :attribute field is required.',
            'unique' => 'The :attribute already exists.',
        ];

        $validator = Validator::make($input, $rules, $messages);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $subject = new Subject();
        $subject->name = $request->input('name');
        $subject->save();

        return response()->json([
            'subject' => $subject,
            'success' => true
        ],200);
    }

    public function update (Request $request, $id){
        $subject = Subject::find($id);

        if(!$subject){
            return response()->json('Not found subject', 404);
        }

        $input = $request->all();
        $subject->name = $request->input('name',$subject->name);
        $subject->save();

        return response()->json([
            'subject' => $subject,
            'success' => true
        ],200);
    }

    public function destroy($id){
        $subject = Subject::find($id);

        if(!$subject){
            return response()->json('Not found subject', 404);
        }

        $subject->delete();
        return response()->json([
            'message' => 'Subject has been deleted',
            'success' => true
        ],200);
    }


    public function assignSubject(Request $request, $subjectId)
    {
        $userId = $request->input('user_id');
        $user = User::find($userId);
        $subject = Subject::find($subjectId);

        if ($user && $subject) {
            $user->subjects()->syncWithoutDetaching([$subjectId]); // Sincroniza la asignatura sin eliminar las anteriores
            return response()->json(['message' => 'Asignatura asignada correctamente'], 200);
        }

        return response()->json(['message' => 'Error al asignar la asignatura'], 400);
    }

    public function removeSubject(Request $request, $subjectId)
    {
        $subject = Subject::find($subjectId);
        if ($subject) {
            $subject->users()->detach();  // Desvincula la asignatura de todos los usuarios
            return response()->json(['message' => 'Asignatura eliminada correctamente'], 200);
        }

        return response()->json(['message' => 'Asignatura no encontrada'], 404);
    }

    public function getUserSubject($userId){
        $user = User::find($userId);

        if(!$user){
            return response()->json('Not found user', 404);
        }

        $subjects = $user -> subjects;

        return response()->json($subjects, 200);
    }

}
