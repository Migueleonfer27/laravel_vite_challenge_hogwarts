<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

//Monica
class AdminController extends Controller
{
     //Monica
    public function index()
    {
        $users = User::with('roles')->get();
        if ($users->isEmpty()) {
            return response()->json('Not found users', 404);
        } else {
            return response()->json($users, 200);
        }
    }
     //Monica
    public function show($id)
    {
        $user = User::with('roles')->find($id);

        if ($user) {
            return response()->json($user, 200);
        } else {
            return response()->json('User not found', 404);
        }
    }
     //Monica
    public function create(Request $request)
    {
        $input = $request->all();
        $rules = [
            'name' => 'required|string|max:20',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6'
        ];
        $messages = [
            'required' => 'the :attribute is required',
            'unique' => 'the :attribute already exists',
            'min' => 'the :attribute must be at least :min characters'
        ];
        $validator = Validator::make($input, $rules, $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = new User();
        $user->name = $request['name'];
        $user->email = $request['email'];
        $user->password = hash::make($request['password']);
        $user->save();
        return response()->json(['user' => $user,
        'success' => true,
        ], 201);
    }
     //Monica
    public function update(Request $request, $id)
    {
        $input = $request->all();
        $rules = [
            'name' => 'string|max:20',
            'email' => 'string|email|max:255'
        ];
        $messages = [
            'unique' => 'the :attribute already exists'
        ];
        $validator = Validator::make($input, $rules, $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::find($id);

        if (is_null($user)) {
            return response()->json([
                'message' => 'User not found',
                'success' => false
            ], 404);
        } else {
            $user->name = $request['name'];
            $user->email = $request['email'];
            $user->save();
            return response()->json(['user' => $user,
            'success' => true,
            ], 200);
        }
    }
    //Monica
    public function destroy($id)
    {
        $user = User::with('roles')->find($id);

        if ($user) {
            $user->delete();
            return response()->json(['message' => 'user was deleted sucesfully','success' => true], 200);
        } else {
            return response()->json(['message' => 'user not found', 'success' => false], 404);
        }
    }
     //Monica
    public function giveRole(Request $request, $id)
    {
        $input = $request->all();
        $rules = [
            'role_id' => 'required|integer|exists:roles,id'
        ];
        $messages = [
            'required' => 'the :attribute is required',
            'exists' => 'the :attribute dont exists',
            'integer' => 'the :attribute must be an integer'
        ];
        $validator = Validator::make($input, $rules, $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::find($id);

        if (is_null($user)) {
            return response()->json('User not found', 404);
        }

        $role_id = $request->input('role_id');

        $user->roles()->syncWithoutDetaching([$role_id]);
        return response()->json(['message' => 'Role assigned successfully.', 'success' => true], 200);
    }

     //Monica
    public function retireRole(Request $request, $id)
    {
        $input = $request->all();
        $rules = [
            'role_id' => 'required|integer|exists:roles,id'
        ];
        $messages = [
            'required' => 'the :attribute is required',
            'exists' => 'the :attribute dont exists',
            'integer' => 'the :attribute must be an integer'
        ];
        $validator = Validator::make($input, $rules, $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::find($id);

        if (is_null($user)) {
            return response()->json('User not found', 404);
        }

        $role_id = $request->input('role_id');

        $user->roles()->detach([$role_id]);
        return response()->json(['message' => 'Role removed successfully.', 'success' => true], 200);
    }

     //Monica
    public function getRole()
    {
        $roles = DB::table('roles')->get();
        return response()->json($roles, 200);
    }
//Monica
    public function getNameStudent(){
        $students = DB::table('users as u')
            ->select('u.name')
            ->join('role_user as ru', 'u.id', '=', 'ru.user_id')
            ->join('roles as r', 'ru.role_id', '=', 'r.id')
            ->where('r.name', '=', 'student')
            ->get();

        return response()->json($students, 200);
    }


}
