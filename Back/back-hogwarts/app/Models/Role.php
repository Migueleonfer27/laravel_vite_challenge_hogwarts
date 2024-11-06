<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model{

    //Cynthia
    public function users(){
        return $this->belongsToMany(User::class,'role_user');
    }
}
