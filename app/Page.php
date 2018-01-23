<?php

namespace App;

use Dimsav\Translatable\Translatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Page
 * @package App
 */
class Page extends Model
{
    use Translatable;
    use SoftDeletes;

    protected $table = 'pages';
    protected $dates = [ 'deleted_at' ];

    //
    public $translatedAttributes = [
        'title',
        'content'
    ];

    //
    protected $fillable = [
        'slug',
        'enabled',
        'deleted'
    ];

}
