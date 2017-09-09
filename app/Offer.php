<?php

namespace App;

use Dimsav\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Offer
 * @package App
 */
class Offer extends Model
{
    use Translatable;
    use SoftDeletes;

    protected $table = 'offers';
    protected $dates = [ 'deleted_at' ];

    //
    public $translatedAttributes = [
        'title',
        'description',
        'opening_hours'
    ];

    //
    protected $fillable = [
        'ngo_id',
        'street',
        'streetnumber',
        'streetnumberadditional',
        'zip',
        'city',
        'latitude',
        'longitude',
        'phone',
        'email',
        'website',
        'age_from',
        'age_to',
        'valid_from',
        'valid_until',
        'enabled',
        'deleted'
    ];

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
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function filters()
    {
        return $this->belongsToMany(
            'App\Filter',
            'offer_filters',
            'offer_id',
            'filter_id'
        );
    }

    /**
     * @return mixed
     */
    public function categories()
    {
        return $this->belongsToMany(
            'App\Category',
            'offer_categories',
            'offer_id',
            'category_id'
        )->with(
            [
                'parents',
                'image'
            ]
        );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function countries()
    {
        return $this->belongsToMany(
            'Webpatser\Countries\Countries',
            'offer_countries',
            'offer_id',
            'country_id'
        );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function image()
    {
        return $this->belongsTo( 'App\Image' );
    }

}
