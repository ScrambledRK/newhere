<?php

namespace App;

use Dimsav\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use Translatable;

    //
    public $translatedAttributes = [
        'title',
        'description'
    ];

    //
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
        $result = $this->hasMany( 'App\Category', 'parent_id', 'id' )
                       ->where( 'enabled', true )
                       ->orderBy( 'sortindex', 'ASC' )
                       ->with( 'image' );
                     //  ->has( 'offers' )
                    //   ->orHas( '_children' );

        return $result;
    }

    //
    public function allChildren()
    {
        return $this->hasMany('App\Category', 'parent_id', 'id')
                    ->with('allChildren');
    }

    //
//    public function _children()
//    {
//        return $this->hasMany( 'App\Category', 'parent_id', 'id' );
//    }


    /**
     * @return mixed
     */
    public function parent()
    {
        return $this->hasOne( 'App\Category', 'id', 'parent_id' )
                    ->where( 'enabled', true )
                    ->with( [ 'parent', 'image' ] );
    }

    /**
     * @return mixed
     */
    public function offers()
    {
        return $this->belongsToMany( 'App\Offer', 'offer_categories',
                                     'category_id', 'offer_id' )
                    ->where( 'enabled', true )
                    ->with(
                        [
                            'ngo' => function( $q )
                            {
                                $q->where( 'published', true );
                            },
                            'filters',
                            'image'
                        ] );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function image()
    {
        return $this->belongsTo( 'App\Image' );

    }
}
