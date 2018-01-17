<?php

namespace App\Http\Controllers;

use App\Logic\Address\AddressAPI;
use App\Offer;
use Illuminate\Http\Request;

class Search extends Controller
{
    /**
     * @param $search
     * @return \Illuminate\Http\JsonResponse
     */
    public function address( $search )
    {
        $addressApi = new AddressAPI();
        $returnArray = $addressApi->getAddressSuggestions( $search );

        return response()->json( $returnArray );
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function offers( Request $request )
    {
        $toSearch = $request->get( 'query' );

        $result = Offer::with( [ 'ngo', 'categories' ] )
                       ->where( 'enabled', true )
                       ->where( function( $query ) use ( $toSearch )
                       {
                           $query->whereHas( 'translations',
                               function( $query ) use ( $toSearch )
                               {
                                   $query->where(
                                       'title',
                                       'ilike',
                                       '%' . $toSearch . '%'
                                   );
                               } )
                                 ->orWhereHas( 'translations',
                                     function( $query ) use ( $toSearch )
                                     {
                                         $query->where(
                                             'description',
                                             'ilike',
                                             '%' . $toSearch . '%'
                                         );
                                     } )
                                 ->orWhere(
                                     'street',
                                     'ilike',
                                     '%' . $toSearch . '%'
                                 )
                                 ->orWhere(
                                     'zip',
                                     'ilike',
                                     '%' . $toSearch . '%'
                                 )
                                 ->orWhereHas( 'ngo',
                                     function( $query ) use ( $toSearch )
                                     {
                                         $query->where(
                                             'organisation',
                                             'ilike',
                                             '%' . $toSearch . '%'
                                         )->where( 'published', true );
                                     } )
                                 ->orWhereHas( 'categories',
                                     function( $query ) use ( $toSearch )
                                     {
                                         $query->whereHas( 'translations',
                                             function( $q ) use ( $toSearch )
                                             {
                                                 $q->where(
                                                     'title',
                                                     'ilike',
                                                     '%' . $toSearch . '%'
                                                 );
                                             } );
                                     } )
                                 ->orWhereHas( 'categories.parent',
                                     function( $query ) use ( $toSearch )
                                     {
                                         $query->whereHas( 'translations',
                                             function( $q ) use ( $toSearch )
                                             {
                                                 $q->where(
                                                     'title',
                                                     'ilike',
                                                     '%' . $toSearch . '%'
                                                 );
                                             } );
                                     } )
                                 ->orWhereHas( 'categories.parent.parent',
                                     function( $query ) use ( $toSearch )
                                     {
                                         $query->whereHas( 'translations',
                                             function( $q ) use ( $toSearch )
                                             {
                                                 $q->where(
                                                     'title',
                                                     'ilike',
                                                     '%' . $toSearch . '%' );
                                             } );
                                     } );
                       } )
                       ->get();

        $count = $result->count();

        return response()->success( compact( 'result', 'count' ) );
    }
}