<?php

namespace App\Http\Controllers\Main;

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
        $result = Ngo::with( ['image'] );

        //
        $result = $result->where('published', true );
        $count = $result->count();

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
     * @param $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function byId( Request $request, $id )
    {
        $result = Ngo::with( ['image'] );

        //
        $result = $result->where('published', true );
        $result = $result->where('id', $id );

        //
        if( $request->get( 'withOffers', false ) )
            $result = $result->with( ['offers'] );

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        $result = $this->paginate( $request, $result );

        //
        $result = $result->firstOrFail();

        // ------------------------------------------- //
        // ------------------------------------------- //

        return response()->json($result);
    }

}
