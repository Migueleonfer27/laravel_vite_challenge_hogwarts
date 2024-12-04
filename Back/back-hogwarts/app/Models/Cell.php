<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cell extends Model
{
    use HasFactory;

    protected $fillable = ['map_id', 'posicion_x', 'posicion_y', 'content', 'second_content'];

    public function map()
    {
        return $this->belongsTo(Map::class);
    }
}
