<?php

namespace App\Http\Controllers\Main;

use Illuminate\Http\Request;
use App;
use DB;
use App\Http\Controllers\Controller;
use App\Category;
use App\Language;

class CategoryController extends Controller
{

    public function trace()
    {
        $result = Category::with( [] );

        //
        $result = $result->where( 'enabled', true );
        $result = $result->where( 'slug', 'start' );
        $result = $result->withCount( 'offers' );
        $result = $result->with( 'allChildren' )->where( function( $query )
        {
            $query->where( 'enabled', true );
            // ->has( 'offers', '>=', 1 );
        } );

        //
        $result = $result->get();

        //
        return response()->json( $result );
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function index( Request $request )
    {
        $result = Category::with(
            [
                'image'
            ]
        );

        //
        $count = $result->count();

        //
        if( $request->has( 'enabled' ) )
        {
            $result = $result->where( 'enabled', $request->get( 'enabled' ) );
            $count = $result->count();
        }

        //
        if( $request->has( 'parent_id' ) )
        {
            $parent_id = $request->get( 'parent_id' );

            if( $parent_id == 0 )
                $parent_id = null;

            $result = $result->where( 'parent_id', $parent_id );
            $count = $result->count();
        }

        //
        if( $request->has( 'title' ) )
        {
            $result = $result->whereTranslationLike( 'title', '%' . $request->get( 'title' ) . '%' );
            $count = $result->count();
        }

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        $result = $this->paginate( $request, $result );

        //
        $result = $result->get();

        // ------------------------------------------- //
        // ------------------------------------------- //

        return response()->success( compact( 'result', 'count' ) );
    }

    /**
     * @param $request
     * @param $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function bySlug( Request $request, $slug )
    {
        $result = Category::with( [ 'image', 'page' ] );

        //
        $result = $result->where( 'enabled', true );
        $result = $result->where( 'slug', $slug );

        //
        if( $request->get( 'withOffers', false ) )
        {
            $now = date( "Y-m-d h:i:s" );

            $result = $result->with(
                [
                    'offers' => function( $q ) use ( $now )
                    {
                        $q->where( function( $query ) use ( $now )
                        {
                            $query->whereDate( 'valid_from', '<=', $now )
                                  ->orWhereNull( 'valid_from' );
                        } )
                          ->where( function( $query ) use ( $now )
                          {
                              $query->whereDate( 'valid_until', '>=', $now )
                                    ->orWhereNull( 'valid_until' );
                          } );
                    }
                ] );
        }


        //
        if( $request->get( 'withParents', false ) )
            $result = $result->with( [ 'parent' ] );

        //
        if( $request->get( 'withChildren', false ) )
            $result = $result->with( [ 'children' ] );

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        $result = $this->paginate( $request, $result );

        //
        $result = $result->get();

        // ------------------------------------------- //
        // ------------------------------------------- //

        return response()->json( $result );
    }

}
