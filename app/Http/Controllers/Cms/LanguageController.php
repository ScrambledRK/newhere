<?php

namespace App\Http\Controllers\Cms;

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
        $languages = Language::all();
        $this->translationService->translateLanguage( $languages, App::getLocale() );

        return response()->success( compact( 'languages' ) );
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function defaultLanguage()
    {
        $language = Language::where( 'default_language', true )->first();

        if( !$language )
            return response()->error( 'No default language found', 404 );

        $this->translationService->translateLanguage( $language, App::getLocale() );

        return response()->json( $language );
    }

    /**
     * @return mixed
     */
    public function enabledIndex()
    {
        $enabled = Language::where( 'enabled', true )->get();
        $this->translationService->translateLanguage( $enabled, App::getLocale() );

        return response()->success( compact( 'enabled' ) );
    }

    /**
     * @return mixed
     */
    public function publishedIndex()
    {
        $published = Language::where( 'enabled', true )
                             ->where( 'published', true )
                             ->get();

        foreach( $published as $language )
        {
            $language->translatedName = Locale::getDisplayLanguage( $language->language, $language->language );
        }

        $this->translationService->translateLanguage( $published, App::getLocale() );

        return response()->success( compact( 'published' ) );
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

        $language = Language::findOrFail( (int)$id );
        $modified = false;

        if( isset( $request->enabled ) )
        {
            $language->enabled = (bool)$request->enabled;
            $modified = true;
        }

        if( isset( $request->published ) )
        {
            $language->published = (bool)$request->published;
            $modified = true;
        }

        if( $modified )
        {
            $language->save();
        }

        return response()->success( compact( 'language' ) );
    }
}
