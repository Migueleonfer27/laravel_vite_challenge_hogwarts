<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Potion extends Model{
    use HasFactory;


    public function user(){
        return $this->belongsTo(User::class, 'creator');
    }

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class);
    }



}
