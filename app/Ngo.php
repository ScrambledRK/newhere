<?php

namespace App;

use Dimsav\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class Ngo extends Model
{
    use Translatable;

    protected $table = 'ngos';

    //
    public $translatedAttributes = [ 'description' ];

    //
    protected $fillable = [
        'organisation',
        'street',
        'street_number',
        'zip',
        'city',
        'website',
        'contact',
        'contact_email',
        'contact_phone',
        'published',
        'latitude',
        'longitude'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function offers()
    {
        return $this->hasMany(
            'App\Offer',
            'ngo_id',
            'id'
        )->where( 'enabled', true );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(
            'App\User',
            'ngo_users'
        );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function image()
    {
        return $this->belongsTo( 'App\Image' );
    }

    public function notes()
    {
        return $this->belongsTo( 'App\NgoNotes', 'note_id', 'id' );
    }
}
