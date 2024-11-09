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
        //Monica
        User::create([
            'name' => 'Root',
            'email' => 'root@root.com',
            'password' => bcrypt('123456'),
        ]);

        $adminUser = DB::table('users')->where('email', 'root@root.com')->first();
        $adminRole = DB::table('roles')->where('name', 'Dumbledore')->first();
        DB::table('role_user')->insert([
            'role_id' => $adminRole->id,
            'user_id' => $adminUser->id
        ]);

    }
}
