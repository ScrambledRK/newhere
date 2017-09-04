<?php

namespace App\Http\Controllers;

use App\Ngo;
use App\Offer;

class Statistics extends Controller
{

    /**
     * @return mixed
     */
    public function offers()
    {
        //
        $activeEnabledOffers = Offer::where( 'enabled', 1 )
                                    ->where( function( $query )
                                    {
                                        $query->whereNull( 'valid_from' )
                                              ->whereNull( 'valid_until' )
                                              ->orWhere( function( $query )
                                              {
                                                  $query->whereDate( 'valid_from', '<', date( 'Y-m-d' ) )
                                                        ->whereDate( 'valid_until', '>', date( 'Y-m-d' ) );
                                              } );
                                    } )->count();

        //
        $activeDisabledOffers = Offer::where( 'enabled', 0 )
                                     ->where( function( $query )
                                     {
                                         $query->whereNull( 'valid_from' )
                                               ->whereNull( 'valid_until' )
                                               ->orWhere( function( $query )
                                               {
                                                   $query->whereDate( 'valid_from', '<', date( 'Y-m-d' ) )
                                                         ->whereDate( 'valid_until', '>', date( 'Y-m-d' ) );
                                               } );
                                     } )->count();

        //
        $expiredOffers = Offer::where( 'enabled', 1 )
                              ->whereNotNull( 'valid_from' )
                              ->whereNotNull( 'valid_until' )
                              ->whereDate( 'valid_until', '<', date( 'Y-m-d' ) )
                              ->count();

        //
        $futureOffers = Offer::where( 'enabled', 1 )
                             ->whereNotNull( 'valid_from' )
                             ->whereNotNull( 'valid_until' )
                             ->whereDate( 'valid_from', '>', date( 'Y-m-d' ) )
                             ->count();

        //
        return response()->success(
            [
                'stats' => [
                    'active'  => [
                        'enabled'  => $activeEnabledOffers,
                        'disabled' => $activeDisabledOffers,
                        'total'    => $activeEnabledOffers + $activeDisabledOffers,
                    ],
                    'expired' => $expiredOffers,
                    'future'  => $futureOffers
                ]
            ]
        );
    }

    /**
     * @return mixed
     */
    public function ngos()
    {
        $publishedNgos = Ngo::where( 'published', 1 )->count();
        $unpublishedNgos = Ngo::where( 'published', 0 )->count();

        return response()->success(
            [
                'stats' => [
                    'published'   => $publishedNgos,
                    'unpublished' => $unpublishedNgos,
                    'total'       => $publishedNgos + $unpublishedNgos
                ]
            ]
        );
    }
}