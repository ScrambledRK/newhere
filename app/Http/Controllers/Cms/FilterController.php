<?php

namespace App\Http\Controllers\Cms;

use Illuminate\Http\Request,
    App,
    DB,
    App\Http\Requests,
    App\Http\Controllers\Controller,
    App\Filter,
    App\Language;

class FilterController extends Controller
{
    public function __construct()
    {
        App::setLocale( app( 'request' )->header( 'language' ) );
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function index( Request $request )
    {
        $result = null;

        //
        if( $request->get( 'all' ) )
        {
            $result = Filter::withTranslation()
                             ->orderBy( 'id', 'ASC' )
                             ->get();
        }
        else
        {

            $result = Filter::where( 'parent_id', null )
                             ->withTranslation()
                             ->orderBy( 'type' )
                             ->get();
        }

        //
        $result->load( [ 'children', 'image' ] );

        //
        return response()->success( compact( 'result' ) );
    }

}
