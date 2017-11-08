<?php

namespace App\Http\Controllers\Cms;

use App\Category;
use App\Filter;
use App\Http\Controllers\Controller;
use App\Logic\Address\AddressAPI;
use App\Ngo;
use App\Offer;
use App\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class ProviderController extends Controller
{

    /**
     * @param Request $request
     * @return mixed
     */
    public function index( Request $request )
    {
        $user = Auth::user();
        $result = null;

        if( $this->isUserAdmin( $user ) )
        {
            $result = Ngo::with([]); // only thing I found that returns a builder and not a collection
        }
        else
        {
            $result = Ngo::whereHas( 'users', function( $q ) use ( $user )
            {
                $q->where( 'user_id', $user->id );
            } );
        }

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        if( $request->has( 'enabled' ) )
        {
            $result = $result->where( 'published',
                                      $request->get( 'enabled' ) );
        }

        //
        if( $request->has( 'title' ) )
        {
            $toSearch = $request->get( 'title' );

            $result = $result->where( function( $query ) use ( $toSearch )
            {
                $query->where(
                    'organisation',
                    'ilike',
                    '%' . $toSearch . '%'
                );
            } );
        }

        //
        if( $request->has( 'withCounts' ) )
        {
            $result->withCount("offers");
            $result->withCount("users");
        }

        //
        $count = $result->count();
        $result = $this->paginate( $request, $result );

        //
        $result = $result->get();

        // ------------------------------------------- //
        // ------------------------------------------- //

        return response()->success( compact( 'result', 'count' ) );
    }

}
