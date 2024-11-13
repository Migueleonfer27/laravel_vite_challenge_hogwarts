<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model{
    use HasFactory;

    protected $fillable = [
        'name',
        'healing',
        'poisoning',
        'analgesic',
        'pain',
        'curative',
        'sickening',
        'inflammatory',
        'deinflammatory',
        'url_photo'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function potions(){
        return $this->belongsToMany(Potion::class);
    }

}
