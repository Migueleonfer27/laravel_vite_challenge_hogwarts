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

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function potions()
    {
        return $this->belongsToMany(Potion::class, 'potion_ingredient', 'id_ingredient', 'id_potion');
    }
}
