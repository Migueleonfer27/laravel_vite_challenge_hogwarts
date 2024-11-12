<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Potion extends Model{
    use HasFactory;

    protected $fillable = [
      'name',
      'user_id',
      'good_level',
      'bad_level',
    ];
}
