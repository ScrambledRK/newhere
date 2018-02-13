<?php

namespace App;

use Dimsav\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class NgoNotes extends Model
{
    protected $table = 'ngo_notes';

    //
    protected $fillable = [
        'checked',
        'notes'
    ];

    //
    public function user()
    {
        return $this->belongsTo( 'App\User', 'user_id', 'id' );
    }
}
