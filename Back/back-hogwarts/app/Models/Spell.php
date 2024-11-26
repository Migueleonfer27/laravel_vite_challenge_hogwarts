<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Spell extends Model
{
    public function user(){
        return $this->belongsTo(User::class, 'creator');
    }


    public function duels(){
        return $this->belongsToMany(Duel::class);
    }

}
