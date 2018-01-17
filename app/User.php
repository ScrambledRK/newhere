<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Zizaco\Entrust\Traits\EntrustUserTrait;

class User extends Authenticatable
{
    use EntrustUserTrait;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'confirmation_code'
    ];

    public function ngos()
    {
        return $this->belongsToMany( 'App\Ngo', 'ngo_users' );
    }

    public function pendings()
    {
        return $this->hasMany( 'App\PendingRequest',
                                     'user_id', 'id' );
    }

    public function roles()
    {
        return $this->belongsToMany( 'App\Role',
                               'role_user' );
    }

    public function languages()
    {
        return $this->belongsToMany( 'App\Language', 'user_languages' );
    }
}
