<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model{
    use HasFactory;

    protected $fillable = [
        'id',
        'name'
    ];

    public function users(){
        return $this->belongsToMany(User::class,'subject_user','subject_id','user_id');
    }
}
