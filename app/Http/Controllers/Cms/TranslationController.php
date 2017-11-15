<?php

namespace App\Http\Controllers\Cms;

use App\Category;
use App\Filter;
use App\Offer;
use App\OfferTranslation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests;
use App\User;
use App\Role;
use App\Ngo;
use App\Language;
use Auth;

use DB;

class TranslationController extends Controller
{

    /**
     * @param Request $request
     * @return mixed
     */
    public function index( Request $request, $type )
    {
        $result = null;

        switch( $type )
        {
            case "offer":
                $result = $this->indexOffer( $request );
                break;

            case "provider":
                $result = $this->indexProvider( $request );
                break;

            case "filter":
                $result = $this->indexFilter( $request );
                break;

            case "category":
                $result = $this->indexCategory( $request );
                break;
        }

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        $count = $result->count();
        $result = $this->paginate( $request, $result );

        //
        $result = $result->get();

        // ------------------------------------------- //
        // ------------------------------------------- //

        return response()->success( compact( 'result', 'count' ) );
    }

    //
    private function indexOffer( Request $request )
    {
        $result = Offer::with( [ "translations" ] );

        //
        if( $request->has( 'enabled' ) )
        {
            $result = $result->where( 'enabled', $request->get( 'enabled' ) );
        }

        //
        if( $request->has( 'title' ) )
        {
            $toSearch = $request->get( 'title' );

            //
            $result = $result->whereHas( 'translations',
                function( $query ) use ( $toSearch )
                {
                    $query->where(
                        'title',
                        'ilike',
                        '%' . $toSearch . '%'
                    )->orWhere(
                        'description',
                        'ilike',
                        '%' . $toSearch . '%'
                    );
                } );
        }

        return $result;
    }

    //
    private function indexProvider( Request $request )
    {
        $result = Ngo::with( [ "translations" ] );

        //
        if( $request->has( 'enabled' ) )
        {
            $result = $result->where( 'published', $request->get( 'enabled' ) );
        }

        //
        if( $request->has( 'title' ) )
        {
            $toSearch = $request->get( 'title' );

            //
            $result = $result->whereHas( 'translations',
                function( $query ) use ( $toSearch )
                {
                    $query->where(
                        'description',
                        'ilike',
                        '%' . $toSearch . '%'
                    );
                } );
        }

        return $result;
    }

    //
    private function indexFilter( Request $request )
    {
        $result = Filter::with( [ "translations" ] );

        //
        if( $request->has( 'enabled' ) )
        {
            $result = $result->where( 'enabled', $request->get( 'enabled' ) );
        }

        //
        if( $request->has( 'title' ) )
        {
            $toSearch = $request->get( 'title' );

            //
            $result = $result->whereHas( 'translations',
                function( $query ) use ( $toSearch )
                {
                    $query->where(
                        'title',
                        'ilike',
                        '%' . $toSearch . '%'
                    )->orWhere(
                        'description',
                        'ilike',
                        '%' . $toSearch . '%'
                    );
                } );
        }

        return $result;
    }

    //
    private function indexCategory( Request $request )
    {
        $result = Category::with( [ "translations" ] );

        //
        if( $request->has( 'enabled' ) )
        {
            $result = $result->where( 'enabled', $request->get( 'enabled' ) );
        }

        //
        if( $request->has( 'title' ) )
        {
            $toSearch = $request->get( 'title' );

            //
            $result = $result->whereHas( 'translations',
                function( $query ) use ( $toSearch )
                {
                    $query->where(
                        'title',
                        'ilike',
                        '%' . $toSearch . '%'
                    )->orWhere(
                        'description',
                        'ilike',
                        '%' . $toSearch . '%'
                    );
                } );
        }

        return $result;
    }

    /**
     * @return array
     */
    private function loadLanguages()
    {
        $user = Auth::user();
        $user->load( 'roles' );

        $allLanguages = true;

        //
        foreach( $user->roles as $role )
        {
            if( in_array( $role->name, [ 'moderator' ] ) )
            {
                $allLanguages = false;
                break;
            }
        }

        //
        $decreaseCount = 0;

        if( $allLanguages )
        {
            $languages = \App\Language::where( 'enabled', true )->get();
            $decreaseCount = 1;
        }
        else
        {
            $languages = $user->languages()->get();

            foreach( $languages as $language )
            {
                if( $language->default_language )
                {
                    $decreaseCount = 1;
                    break;
                }
            }
        }

        //
        return [
            $languages,
            $languages->count() - $decreaseCount
        ];
    }
}