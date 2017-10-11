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


class OfferController extends Controller
{

    /**
     * @param Request $request
     * @return mixed
     */
    public function index( Request $request )
    {
        $result = Offer::with(
            [
                'ngo'
            ]
        );

        //
        $count = $result->count();

        // ------------------- //

        $user = Auth::user();

        if( !$this->isUserAdmin( $user ) )
        {
            $user->load( 'ngos' );
            $ngos = $user->getRelations()["ngos"];

            foreach ($ngos as $ngo)
            {
                $result = $result->orWhere( 'ngo_id', $ngo->getAttribute("id") );
                $count = $result->count();
            }
        }

        // ------------------- //

        //
        if( $request->has( 'ngo_id' ) )
        {
            $result = $result->where( 'ngo_id', $request->get( 'ngo_id' ) );
            $count = $result->count();
        }

        //
        if( $request->has( 'enabled' ) )
        {
            $result = $result->where( 'enabled', $request->get( 'enabled' ) );
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

}
