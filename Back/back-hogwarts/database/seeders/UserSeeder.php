<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */


    public function run(): void
    {
        $user = User::create([
            'name' => 'Dumbledore',
            'email' => 'Dumbledore@root.com',
            'password' => bcrypt('123456'),
            'level' => 5,
            'experience' => 500,
            'id_house' => 3
        ]);

        DB::table('role_user')->insert([
            'role_id' => 4,
            'user_id' => $user->id
        ]);
    }
}
