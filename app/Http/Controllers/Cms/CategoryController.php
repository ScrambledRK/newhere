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

    /**
     * @param Request $request
     */
    public function update( Request $request, $id )
    {
        DB::beginTransaction();

        $category = Category::findOrFail( $id );
        $category = $this->populateFromRequest( $request, $category );
        $category->save();

        DB::commit();

        return response()->success( compact( [ 'category' ] ) );
    }

    /**
     * @param Request $request
     * @param Category $category
     * @return Category
     */
    private function populateFromRequest( Request $request, Category $category )
    {
//        $this->validate( $request, [
//            'slug'   => 'required|max:255'
//        ] );

        // ---------------------------------- //
        // ---------------------------------- //

        //
//        $hasTitleChanged        = $category->title     != $request->get( 'title' );
//        $hasDescriptionChanged  = $category->content   != $request->get( 'content' );
//
//        if( $hasTitleChanged || $hasDescriptionChanged )
//        {
//            $locale = $request->header("Language", "de");
//
//            $category->translations()->where("locale","!=", $locale)
//                ->update( [ 'version' => 0 ] );
//
//            $category->translations()->where("locale","=", $locale)
//                ->update( [ 'version' => 2 ] );
//        }

        // ---------------------------------- //
        // ---------------------------------- //

        //
//        $category->slug = $request->get( 'slug' );
//        $category->enabled = $request->get( 'enabled' );
        $category->page_id = $request->get( 'page_id' );

        // ---------------------------------- //
        // ---------------------------------- //

        return $category;
    }
}
