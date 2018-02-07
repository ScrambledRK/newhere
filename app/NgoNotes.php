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
        'updated_at',
        'notes'
    ];

}
