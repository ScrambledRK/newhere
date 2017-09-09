<?php

namespace App;

use Dimsav\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use Translatable;

    public $translatedAttributes = [
        'title',
        'description'
    ];

    protected $fillable = [
        'image_id',
        'disabled',
        'title',
        'description'
    ];

    /**
     * @return mixed
     */
    public function children()
    {
        return $this->hasMany( 'App\Category', 'parent_id', 'id' )
                    ->with( 'image' );
    }

    /**
     * @return mixed
     */
    public function parent()
    {
        return $this->hasOne( 'App\Category', 'id', 'parent_id' )
                    ->with( 'parent' );
    }

    /**
     * @return mixed
     */
    public function offers()
    {
        return $this->belongsToMany( 'App\Offer', 'offer_categories', 'category_id', 'offer_id' )
                    ->with( [ 'ngo', 'filters', 'categories', 'image' ] );
    }

    /**
     * @return mixed
     */
    public function public_offers()
    {
        return $this->belongsToMany( 'App\Offer', 'offer_categories', 'category_id', 'offer_id' )
                    ->with( [ 'ngo', 'filters', 'categories', 'image' ] )
                    ->whereHas( 'ngo', function( $query )
                    {
                        $query->where( 'id', 5 ); // TODO:  $query->where( 'id', 5 );  cannot be right ...
                    } );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function image()
    {
        return $this->belongsTo( 'App\Image' );

    }
}
