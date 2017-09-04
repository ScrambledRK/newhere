<?php

namespace App\Http\Controllers;
use App\Offer;
use Illuminate\Http\Request;

class Search extends Controller
{
    /**
     * @param Request $request
     * @return mixed
     */
    public function offer( Request $request )
    {
        $offers = Offer::with( [ 'ngo', 'categories' ] )
                       ->whereHas( 'translations',
                           function( $query ) use ( $request )
                           {
                               $query->where(
                                   'title',
                                   'ilike',
                                   '%' . $request->get( 'query' ) . '%'
                               );
                           } )
                       ->orWhereHas( 'translations',
                           function( $query ) use ( $request )
                           {
                               $query->where(
                                   'description',
                                   'ilike',
                                   '%' . $request->get( 'query' ) . '%'
                               );
                           } )
                       ->orWhere(
                           'street',
                           'ilike',
                           '%' . $request->get( 'query' ) . '%'
                       )
                       ->orWhere(
                           'zip',
                           'ilike',
                           '%' . $request->get( 'query' ) . '%'
                       )
                       ->orWhereHas( 'ngo',
                           function( $query ) use ( $request )
                           {
                               $query->where(
                                   'organisation',
                                   'ilike',
                                   '%' . $request->get( 'query' ) . '%'
                               );
                           } )
                       ->orWhereHas( 'categories',
                           function( $query ) use ( $request )
                           {
                               $query->whereHas( 'translations',
                                   function( $q ) use ( $request )
                                   {
                                       $q->where(
                                           'title',
                                           'ilike',
                                           '%' . $request->get( 'query' ) . '%'
                                       );
                                   } );
                           } )
                       ->orWhereHas( 'categories.parent',
                           function( $query ) use ( $request )
                           {
                               $query->whereHas( 'translations',
                                   function( $q ) use ( $request )
                                   {
                                       $q->where(
                                           'title',
                                           'ilike',
                                           '%' . $request->get( 'query' ) . '%'
                                       );
                                   } );
                           } )
                       ->orWhereHas( 'categories.parent.parent',
                           function( $query ) use ( $request )
                           {
                               $query->whereHas( 'translations',
                                   function( $q ) use ( $request )
                                   {
                                       $q->where(
                                           'title',
                                           'ilike',
                                           '%' . $request->get( 'query' ) . '%' );
                                   } );
                           } )
                       ->get();

        $count = $offers->count();

        return response()->success( compact( 'offers', 'count' ) );
    }
}