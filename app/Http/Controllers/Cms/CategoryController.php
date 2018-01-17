<?php

namespace App\Http\Controllers\Cms;

use Illuminate\Http\Request;
use App;
use DB;
use App\Http\Controllers\Controller;
use App\Category;
use App\Language;

class CategoryController extends Controller
{

    /**
     * @param $request
     * @param $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function bySlug( Request $request, $slug )
    {
        $result = Category::with( ['image'] );

        //
        $result = $result->where('slug', $slug );

        //
        if( $request->get( 'withChildren', false ) )
            $result = $result->with( ['allChildren'] );

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        $result = $this->paginate( $request, $result );

        //
        $result = $result->get();

        // ------------------------------------------- //
        // ------------------------------------------- //

        return response()->json($result);
    }

}
