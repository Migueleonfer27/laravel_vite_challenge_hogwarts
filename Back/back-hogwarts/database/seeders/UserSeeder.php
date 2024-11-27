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
            'id_house' =>  DB::table('houses')->where('name', 'Gryffindor')->value('id')
        ]);

        DB::table('role_user')->insert([
            'role_id' => DB::table('roles')->where('name', 'dumbledore')->value('id'),
            'user_id' => $user->id
        ]);

        $houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
        $students = [
            ['name' => 'Harry Potter', 'email' => 'harry@hogwarts.com'],
            ['name' => 'Hermione Granger', 'email' => 'hermione@hogwarts.com'],
            ['name' => 'Cedric Diggory', 'email' => 'cedric@hogwarts.com'],
            ['name' => 'Nymphadora Tonks', 'email' => 'tonks@hogwarts.com'],
            ['name' => 'Luna Lovegood', 'email' => 'luna@hogwarts.com'],
            ['name' => 'Cho Chang', 'email' => 'cho@hogwarts.com'],
            ['name' => 'Draco Malfoy', 'email' => 'draco@hogwarts.com'],
            ['name' => 'Pansy Parkinson', 'email' => 'pansy@hogwarts.com']
        ];

        $teachers = [
            ['name' => 'Minerva McGonagall', 'email' => 'mcgonagall@hogwarts.com'], //pociones
            ['name' => 'Severus Snape', 'email' => 'snape@hogwarts.com']//hechizos
        ];

        foreach ($students as $index => $student) {
            $user = User::create([
                'name' => $student['name'],
                'email' => $student['email'],
                'password' => bcrypt('123456'),
                'level' => 1,
                'experience' => 0,
                'id_house' => DB::table('houses')->where('name', $houses[$index % 4])->value('id')
            ]);

            DB::table('role_user')->insert([
                'role_id' => DB::table('roles')->where('name', 'student')->value('id'),
                'user_id' => $user->id
            ]);
        }

        foreach ($teachers as $teacher) {
            $user = User::create([
                'name' => $teacher['name'],
                'email' => $teacher['email'],
                'password' => bcrypt('123456'),
                'level' => 2,
                'experience' => 50,
                'id_house' => DB::table('houses')->where('name', 'Gryffindor')->value('id')
            ]);

            DB::table('role_user')->insert([
                'role_id' => DB::table('roles')->where('name', 'teacher')->value('id'),
                'user_id' => $user->id
            ]);
        }


    }
}
