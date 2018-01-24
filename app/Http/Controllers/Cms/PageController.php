<?php

namespace App\Http\Controllers\Cms;

use App\Category;
use App\Filter;
use App\Http\Controllers\Controller;
use App\Logic\Address\AddressAPI;
use App\Page;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;


class PageController extends Controller
{

    /**
     * @param Request $request
     * @return mixed
     */
    public function index( Request $request )
    {
        if( !$this->isUserAdmin( Auth::user() ) )
            throw new AccessDeniedHttpException();

        // ------------------- //
        
        $result = Page::with([]);

        //
        $count = $result->count();

        // ------------------- //

        //
        if( $request->has( 'enabled' ) )
        {
            $result = $result->where( 'enabled', $request->get( 'enabled' ) );
            $count = $result->count();
        }

        //
        if( $request->has( 'title' ) )
        {
            $toSearch = $request->get( 'title' );

            //
            $result = $result->where( function( $query ) use ( $toSearch )
            {
                $query->whereHas( 'translations',
                    function( $query ) use ( $toSearch )
                    {
                        $query->where(
                            'title',
                            'ilike',
                            '%' . $toSearch . '%'
                        );
                    } );
            } );

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
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function byId( $id )
    {
        if( !$this->isUserAdmin( Auth::user() ) )
            throw new AccessDeniedHttpException();

        //
        $page = Page::where( 'id', $id )->with(
            [
                'translations'
            ]
        )->firstOrFail();

        return response()->json( $page );
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function upload( Request $request )
    {
        $location = (object)[];
        $location->location = '';

        //
        $base = '/uploads/';
        $name = strtotime( 'now' ) . "_" . $request->get("name");

        $location->location = $base . $name;
        $path = public_path() . $base . $name;

        $data = base64_decode( $request->get("data") );
        $success = file_put_contents( $path, $data );

        if( $success )
            return response()->json( $location );

        return null;
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function create( Request $request )
    {
        DB::beginTransaction();

        $page = new Page();
        $page = $this->populateFromRequest( $request, $page );
        $page->save();

        //
        if( $request->has( 'translations' ) )
        {
            foreach( $request->get( 'translations' ) as $key => $translation )
            {
                $page->translateOrNew( $key )->title = $translation[ 'title' ];
                $page->translateOrNew( $key )->content = $translation[ 'content' ];
                $page->save();
            }
        }

        DB::commit();

        return response()->success( compact( 'page' ) );
    }

    /**
     * @param Request $request
     */
    public function update( Request $request, $id )
    {
        DB::beginTransaction();

        $page = Page::findOrFail( $id );
        $page = $this->populateFromRequest( $request, $page );
        $page->save();

        DB::commit();

        return response()->success( compact( [ 'page' ] ) );
    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function delete( Request $request, $id )
    {
        $page = Page::findOrFail( $id );
        $page->delete();

        return response()->success( compact( '$page' ) );
    }

    /**
     * @param Request $request
     * @param Page $page
     * @return Page
     */
    private function populateFromRequest( Request $request, Page $page )
    {
        $this->validate( $request, [
            'title'   => 'required|max:255',
            'content' => 'required',
        ] );

        // ---------------------------------- //
        // ---------------------------------- //

        //
        $hasTitleChanged        = $page->title     != $request->get( 'title' );
        $hasDescriptionChanged  = $page->content   != $request->get( 'content' );

        if( $hasTitleChanged || $hasDescriptionChanged )
        {
            $page->translations()->where("locale","!=","de")
                  ->update( [ 'version' => 0 ] );
        }

        // ---------------------------------- //
        // ---------------------------------- //

        //
        $page->slug = $request->get( 'slug' );
        $page->enabled = $request->get( 'enabled' );
        $page->title = $request->get( 'title' );
        $page->content = $request->get( 'content' );

        // ---------------------------------- //
        // ---------------------------------- //

        return $page;
    }

}
