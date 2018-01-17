<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PendingRequest extends Model
{

    /**
 * @return \Illuminate\Database\Eloquent\Relations\HasOne
 */
    public function ngo()
    {
        return $this->hasOne(
            'App\Ngo',
            'id',
            'ngo_id'
        );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function role()
    {
        return $this->hasOne(
            'App\Role',
            'id',
            'role_id'
        );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function user()
    {
        return $this->hasOne(
            'App\User',
            'id',
            'user_id'
        );
    }
}
