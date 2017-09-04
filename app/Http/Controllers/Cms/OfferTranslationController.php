<?php

namespace App\Http\Controllers\Cms;

use App\Language;
use App\Offer;
use Illuminate\Http\Request;

use App\Http\Requests,
    App\Http\Controllers\Controller,
    Auth,
    App;

class OfferTranslationController extends AbstractTranslationController
{
    /**
     * @var \App\Services\Translation
     */
    private $translationService;

    /**
     * OfferTranslationController constructor.
     * @param App\Services\Translation $translationService
     */
    public function __construct( \App\Services\Translation $translationService )
    {
        $this->translationService = $translationService;
        App::setLocale( app( 'request' )->header( 'language' ) );
    }

    /**
     * @return mixed
     */
    public function index()
    {
        list( $activeLanguages, $activeLanguageCount ) = $this->loadLanguages();

        /**
         * @todo check for verified offers
         */
        $offers = Offer::all();

        foreach( $offers as $offer )
        {
            foreach( $activeLanguages as $language )
            {
                $offer->translate( $language->language );
            }
        }

        return response()->success( [ 'offer-translations' => $offers ] );
    }

    /**
     * @return mixed
     */
    public function untranslatedIndex()
    {
        list( $activeLanguages, $activeLanguageCount ) = $this->loadLanguages();

        $defaultLanguage = Language::where( 'default_language', true )->first();
        $untranslated = [];

        /**
         * @todo check for verified offers
         */
        $offers = Offer::all();

        foreach( $offers as $idx => $offer )
        {
            $translatedLanguages = 0;
            $defaultTranslation = $offer->translate( $defaultLanguage->language );

            if( !$defaultTranslation )
            {
                unset( $offers[ $idx ] );
                continue;
            }

            //
            $version = $defaultTranslation->version;

            foreach( $activeLanguages as $language )
            {
                if( $language->default_language )
                    continue;

                $translation = $offer->translate( $language->language );

                if( $translation && $translation->version == $version )
                    $translatedLanguages++;
            }

            if( $translatedLanguages < $activeLanguageCount )
            {
                $untranslated[] = $offer;
            }
        }

        return response()->success( compact( 'untranslated' ) );
    }

    /**
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function translate( Request $request, $id )
    {
        $this->validate( $request, [
            'language'    => 'required|min:2|max:2',
            'title'       => 'required|string|min:1|max:255',
            'description' => 'required|string|min:1|max:10000',
            // 'opening_hours' => 'string|max:10000',
        ] );

        // ---------------------------------- //
        // ---------------------------------- //

        $offer = Offer::findOrFail( (int)$id );
        $defaultLanguage = Language::where( 'default_language', true )->first();

        if( !$defaultLanguage )
            return response()->error( 'Default language not found', 404 );

        //
        $translationLanguage = Language::where( 'language', $request->get( 'language' ) )->first();

        if( !$translationLanguage )
             return response()->error( 'Language not found', 404 );

        if( !$translationLanguage->enabled )
            return response()->error( 'Language not enabled', 404 );

        //
        $defaultTranslation = $offer->translate( $defaultLanguage->language );

        if( !$defaultTranslation )
            return response()->error( 'Language not found', 404 );

        //
        $transLanguage = $translationLanguage->language;

        $hasChanged = $this->translationService->hasChanged(
            ( $offer->translate( $transLanguage ) ?
                [
                    'title'         => $offer->translate( $transLanguage )->title,
                    'description'   => $offer->translate( $transLanguage )->description,
                    'opening_hours' => $offer->translate( $transLanguage )->opening_hours,
                ] : [
                    'title' => null, 'description' => null, 'opening_hours' => null,
                ]
            ),
            [
                'title'         => $request->get( 'title' ),
                'description'   => $request->get( 'description' ),
                'opening_hours' => $request->get( 'opening_hours' ),
            ]
        );

        if( $hasChanged )
        {
            $offer->translateOrNew( $transLanguage )->title = $request->get( 'title' );
            $offer->translateOrNew( $transLanguage )->description = $request->get( 'description' );
            $offer->translateOrNew( $transLanguage )->opening_hours = $request->get( 'opening_hours' );

            if( $offer->translate( $transLanguage )->version )
            {
                $offer->translateOrNew( $transLanguage )->version = $offer->translate( $transLanguage )->version + 1;
            }
            else
            {
                $offer->translateOrNew( $transLanguage )->version = 1;
            }

            $offer->save();
        }

        return response()->json( $offer );
    }


}
