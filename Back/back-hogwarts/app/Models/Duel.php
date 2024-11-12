<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Duel extends Model{
    use HasFactory;

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function spells(){
        return $this->belongsToMany(Spell::class);
    }
}
