<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App;
use DB;
use App\Http\Controllers\Controller;
use App\Category;
use App\Language;

class CategoryController extends Controller
{

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
     * @param $slug
     * @param $children
     * @return \Illuminate\Http\JsonResponse
     */
    public function bySlug( Request $request, $slug )
    {
        $result = Category::with( ['image'] );

        //
        $result = $result->where('enabled', true );
        $result = $result->where('slug', $slug );

        //
        if( $request->get( 'withParents', false ) )
            $result = $result->with( ['parent'] );

        //
        if( $request->get( 'withChildren', false ) )
            $result = $result->with( ['children'] );

        $result = $result->get();

        return response()->json($result);
    }

}
