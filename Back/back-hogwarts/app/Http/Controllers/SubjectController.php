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


    public function assignSubject(Request $request, $subjectId){

        $input = $request->all();
        $rules = [
            'user_id' => 'required|integer|exists:users,id',
        ];

        $validator =  Validator::make($input, $rules);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $subject = Subject::find($subjectId);

        if(!$subject){
            return response()->json('Not found subject', 404);
        }

        $user = User::find($request->input('user_id'));
        if(!$user){
            return response()->json('Not found user', 404);
        }

        //Asigna nuevas asignaturas sin eliminar las anteriores (funcion de laravel)
        $subject->users()->syncWithoutDetaching([$user->id]);

        return response()->json([
            'message' => 'Subject has been assigned',
            'success' => true
        ],200);
    }

    public function deleteUserSubject(Request $request, $subjectId){
        $input = $request->all();
        $rules = [
            'user_id' => 'required|integer|exists:users,id',
        ];

        $validator =  Validator::make($input, $rules);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $subject = Subject::find($subjectId);

        if(!$subject){
            return response()->json('Not found subject', 404);
        }

        $user = User::find($request->input('user_id'));
        if(!$user){
            return response()->json('Not found user', 404);
        }

        //Elimina una funcion de muchos a muchos (funcion de laravel)
        $subject->users()->detach([$user->id]);

        return response()->json([
            'message' => 'Subject has been removed',
            'success' => true
        ],200);
    }

}
