<?php

namespace App\Http\Controllers;

use App;
use App\Http\Controllers\Controller;
use App\Language;
use Illuminate\Http\Request;
use Locale;

class LanguageController extends Controller
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
        App::setLocale( app( 'request' )->header( 'language' ) );
    }

    /**
     * @return mixed
     */
    public function index()
    {
        $result = Language::all();
        $this->translationService->translateLanguage( $result, App::getLocale() );

        return response()->success( compact( 'result' ) );
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function defaultLanguage()
    {
        $result = Language::where( 'default_language', true )->first();

        if( !$result )
            return response()->error( 'No default language found', 404 );

        $this->translationService->translateLanguage( $result, App::getLocale() );

        return response()->json( $result );
    }

    /**
     * @return mixed
     */
    public function enabledIndex()
    {
        $result = Language::where( 'enabled', true )->get();
        $this->translationService->translateLanguage( $result, App::getLocale() );

        return response()->success( compact( 'result' ) );
    }

    /**
     * @return mixed
     */
    public function publishedIndex()
    {
        $result = Language::where( 'enabled', true )
                             ->where( 'published', true )
                             ->get();

        foreach( $result as $language )
        {
            $language->translatedName = Locale::getDisplayLanguage( $language->language, $language->language );
        }

        $this->translationService->translateLanguage( $result, App::getLocale() );

        return response()->success( compact( 'result' ) );
    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function update( Request $request, $id )
    {
        $this->validate( $request, [
            'enabled'   => 'boolean',
            'published' => 'boolean',
        ] );

        // ---------------------------------- //
        // ---------------------------------- //

        $result = Language::findOrFail( (int)$id );
        $modified = false;

        if( isset( $request->enabled ) )
        {
            $result->enabled = (bool)$request->enabled;
            $modified = true;
        }

        if( isset( $request->published ) )
        {
            $result->published = (bool)$request->published;
            $modified = true;
        }

        if( $modified )
        {
            $result->save();
        }

        return response()->success( compact( 'result' ) );
    }
}
