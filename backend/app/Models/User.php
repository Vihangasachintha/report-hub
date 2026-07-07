<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // Required by JWTSubject: what goes into the token's "sub" claim
    public function getJWTIdentifier()
    {
        return $this->getKey(); // the user's id
    }

    // Required by JWTSubject: any extra data to embed in the token payload
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
        ];
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class);
    }
}