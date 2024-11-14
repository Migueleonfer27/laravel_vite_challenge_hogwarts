<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model{
    use HasFactory;

    public function user(){
        return $this->belongsTo(User::class);
    }


    public function potions(){
        return $this->belongsToMany(Potion::class);
    }

}
