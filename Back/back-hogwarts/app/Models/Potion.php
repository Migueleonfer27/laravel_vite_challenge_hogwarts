<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Potion extends Model{
    use HasFactory;

    protected $fillable = [
        'name',
        'creator',
        'good_level',
        'bad_level',
        'approves'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'creator');
    }

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'potion_ingredient', 'id_potion', 'id_ingredient');
    }
}
