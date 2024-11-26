<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Duel extends Model{
    use HasFactory;


    protected $fillable = [
        'user_id',
        'resultado'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function spell(){
        return $this->belongsToMany(Spell::class, 'spell_duel');
    }

}
