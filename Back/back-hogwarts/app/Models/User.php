<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, hasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'level',
        'experience',
        'id_house',
        'url_photo'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roles(){
        return $this->belongsToMany(Role::class, 'role_user');
    }

    public function house(){
        return $this->belongsTo(House::class, 'id_house');
    }

    public function duels(){
        return $this->hasMany(Duel::class);
    }

    public function potions(){
        return $this->hasMany(Potion::class, 'creator');
    }

    public function subjects(){
        return $this->belongsToMany(Subject::class);
    }

    public function spells(){
        return $this->hasMany(Spell::class);
    }

    public function hasRole($roleName){
        return $this->roles()->where('name', $roleName)->exists();
    }


    public function updateLevelBasedOnExperience() :void{
        if($this -> experience >= 0 && $this -> experience <= 49){
            $this -> level = 1;
        }elseif ($this -> experience >= 50 && $this -> experience <= 149){
            $this -> level = 2;
        }elseif ($this -> experience >= 150 && $this -> experience <= 299){
            $this -> level = 3;
        }elseif ($this -> experience >= 300 && $this -> experience <= 499){
            $this -> level = 4;
        }elseif ($this -> experience >= 500){
            $this -> level = 5;
        }

        if($this -> isDirty('level')){
            $this->save();
        }
    }

    public function addExperienceTeacherSpell(){
        $this->experience += 10;

        // Obtener la casa del usuario
        $house = $this->house;

        // Aumentar los puntos de la casa en 2
        if ($house) {
            $house->points += 2;
            $house->save(); // Guardar los cambios en la casa
        }

        // Guardar los cambios en el usuario
        $this->save();
    }

    public function addExperienceStudentPotion(){
        if ($this->hasRole('student') && $this->subjects->contains('name', 'pócimas')) {
            $this->experience += 2;
            $this->save();
        }
    }

    public function addExperienceStudentSpell(){
        if ($this->hasRole('student') && $this->subjects->contains('name', 'hechizos')) {
            $this->experience += 2;

            // Aumentar los puntos de la casa en 1
            if ($this->house) {
                $this->house->points += 1;
                $this->house->save();  // Guardar los cambios en la casa
            }

            // Guardar los cambios en el usuario
            $this->save();
        }
    }


}
