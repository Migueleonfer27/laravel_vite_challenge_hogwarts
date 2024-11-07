<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

//Monica
class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->get();
        if ($users->isEmpty()) {
            return response()->json('Not found users', 404);
        } else {
            return response()->json($users, 200);
        }
    }

    public function show($id)
    {
        $user = User::with('roles')->find($id);

        if ($user) {
            return response()->json($user, 200);
        } else {
            return response()->json('User not found', 404);
        }
    }

    public function update(Request $request, $id)
    {
        $input = $request->all();
        $rules = [
            'name' => 'string|max:20',
            'email' => 'string|email|max:255|unique:users',
            'password' => 'string|min:5'
        ];
        $messages = [
            'unique' => 'the :attribute already exists',
            'min' => 'the :attribute must be at least 5 characters'
        ];
        $validator = Validator::make($input, $rules, $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::find($id);

        if (is_null($user)) {
            return response()->json('User not found', 404);
        } else {
            $user->name = $request['name'];
            $user->email = $request['email'];
            $user->password = $request['password'];
            $user->save();
            return response()->json($user, 200);
        }
    }
    public function destroy($id)
    {
        $user = User::with('roles')->find($id);

        if ($user) {
            $user->delete();
            return response()->json('User was delete', 204);
        } else {
            return response()->json('User not found.', 404);
        }
    }

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
        return response()->json(['message' => 'Role assigned successfully.'], 200);
    }

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
        return response()->json(['message' => 'Role removed successfully.'], 200);
    }

}
