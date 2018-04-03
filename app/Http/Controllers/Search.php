<?php

namespace App\Http\Controllers;

use App\Category;
use App\Logic\Address\AddressAPI;
use App\Ngo;
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
        $returnArray = $addressApi->getSuggestion( $search );

        return response()->json( $returnArray );
    }

    /**
     * @param $search
     * @return \Illuminate\Http\JsonResponse
     */
    public function addressDetail( $search )
    {
        $addressApi = new AddressAPI();
        $returnArray = $addressApi->getAddress( $search );

        return response()->json( $returnArray );
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function offers( Request $request )
    {
        $toSearch = $request->get( 'query' );

        $r_offers = $this->searchOffers( $toSearch );
        $c_offers = $r_offers->count();

        $r_providers = $this->searchProviders( $toSearch );
        $c_providers = $r_providers->count();

        $r_categories = $this->searchCategories( $toSearch );
        $c_categories = $r_categories->count();

        //
        return response()->success( compact( 'r_offers',
                                             'c_offers',
                                             'r_providers',
                                             'c_providers',
                                             'r_categories',
                                             'c_categories'
                                    ) );
    }

    /**
     * @param $toSearch
     * @return mixed
     */
    private function searchCategories( $toSearch )
    {
        $result = Category::with( [ ] )
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
                                   } );
                     } )
                     ->limit( 5 )
                     ->get();

        return $result;
    }

    /**
     * @param $toSearch
     * @return mixed
     */
    private function searchProviders( $toSearch )
    {
        $result = Ngo::with( [ ] )
                       ->where( 'published', true )
                       ->where( function( $query ) use ( $toSearch )
                       {
                           $query->whereHas( 'translations',
                               function( $query ) use ( $toSearch )
                               {
                                   $query->where(
                                       'organisation',
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
                                 );
                       } )
                       ->limit( 5 )
                       ->get();

        return $result;
    }

    /**
     * @param $toSearch
     * @return mixed
     */
    private function searchOffers( $toSearch )
    {
        $result = Offer::with( ['categories'] )
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
                                 );
                       } )
                       ->limit( 5 )
                       ->get();

        return $result;
    }
}