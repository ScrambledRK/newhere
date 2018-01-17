<?php

namespace App\Http\Controllers;

use App;
use App\Language;
use App\Ngo;
use App\Offer;

// TODO: do not extend and inherit translation specific code in statistics
class Statistics extends AbstractTranslationController
{
    /**
     * @var \App\Services\Translation
     */
    private $translationService;

    /**
     * LanguageController constructor.
     * @param App\Services\Translation $translationService
     */
    public function __construct( \App\Services\Translation $translationService )
    {
        $this->translationService = $translationService;
    }

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

    /**
     * @return mixed
     */
    public function translations()
    {
        list( $activeLanguages, $activeLanguageCount ) = $this->loadLanguages();

        $defaultLanguage = Language::where( 'default_language', true )->first();

        $offers = Offer::all();
        $stats = [];

        //
        foreach( $offers as $idx => $offer )
        {
            $defaultTranslation = $offer->translate( $defaultLanguage->language );

            if( !$defaultTranslation )
            {
                unset( $offers[ $idx ] );
                continue;
            }

            $version = $defaultTranslation->version;

            foreach( $activeLanguages as $language )
            {
                if( $language->default_language )
                    continue;

                if( !isset( $stats[ $language->language ] ) )
                {
                    $this->translationService->translateLanguage( $language, App::getLocale() );
                    $stats[ $language->language ][ 'language' ] = $language;
                    $stats[ $language->language ][ 'translated' ] = 0;
                    $stats[ $language->language ][ 'untranslated' ] = 0;
                }

                //
                $translation = $offer->translate( $language->language );

                if( $translation && $translation->version == $version )
                {
                    $stats[ $language->language ][ 'translated' ]++;
                }
                else
                {
                    $stats[ $language->language ][ 'untranslated' ]++;
                }
            }
        }

        return response()->success(
            [
                'stats' => $stats
            ] );
    }
}