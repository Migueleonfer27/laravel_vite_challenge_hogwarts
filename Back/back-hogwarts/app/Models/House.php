<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class House extends Model{
    use hasFactory;

    protected $fillable = [
        'name',
        'points',
    ];

    public function user(){
        return $this->hasMany(User::class,'id_house');
    }
}
