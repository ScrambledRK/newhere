<?php

namespace App\Http\Controllers\Cms;

use App\Category;
use App\Filter;
use App\Offer;
use App\OfferTranslation;
use Exception;
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
            {
                $result = $this->indexOffer( $request );

                $table_translation = 'offer_translations';
                $table_data = 'offers';
                $join_field = 'offer_id';

                break;
            }

            case "provider":
            {
                $result = $this->indexProvider( $request );

                $table_translation = 'ngo_translations';
                $table_data = 'ngos';
                $join_field = 'ngo_id';

                break;
            }

            case "filter":
            {
                $result = $this->indexFilter( $request );

                $table_translation = 'filter_translations';
                $table_data = 'filters';
                $join_field = 'filter_id';

                break;
            }

            case "category":
            {
                $result = $this->indexCategory( $request );

                $table_translation = 'category_translations';
                $table_data = 'categories';
                $join_field = 'category_id';

                break;
            }

            default:
                throw new Exception('unknown translation type');
        }

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        if( $request->has( 'status' ) )
        {
            $toSearch = (int) $request->get( 'status' );

            //
            $result = $result->whereHas( 'translations',
                function( $query ) use ( $toSearch )
                {
                    $query->where(
                        'version',
                        $toSearch
                    );
                } );
        }

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        if( $request->has( 'order' ) )
        {
            $order = $request->get( 'order' );
            $dir = 'DESC';

            if( substr( $order, 0, 1 ) == '-' )
            {
                $dir = 'ASC';
                $order = substr( $order, 1 );
            }

            //
            if( $this->isActiveLanguage( $order ) )
            {
                $result = $result->join( $table_translation,
                    function( $join ) use ( $order, $table_translation, $table_data, $join_field )
                    {
                        $join->on( $table_data . '.id', '=', $table_translation . '.' . $join_field )
                             ->where( $table_translation . '.locale', '=', $order );
                    } )
                                 ->select( $table_data . '.*', $table_translation . '.version' )
                                 ->distinct()
                                 ->groupBy( [ $table_data . '.id', 'version' ] )
                                 ->orderBy( 'version', $dir );
            }
            else
            {
                $result = $result->distinct();
                $result = $this->order( $request, $result );
            }
        }

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        $result = $result->get();   // "get" must be before count, because of grouping
        $count = $result->count( ); // would only count in group for some reason

        $result = $this->limit( $request, $result );


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

    /**
     * @param $lang
     * @return bool
     */
    private function isActiveLanguage( $lang )
    {
        list( $activeLanguages, $activeLanguageCount ) = $this->loadLanguages();

        foreach( $activeLanguages as $language )
        {
            if( $language->language == $lang )
                return true;
        }

        return false;
    }
}