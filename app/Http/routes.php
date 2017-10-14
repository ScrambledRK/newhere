<?php

Route::pattern('id', '[0-9]+');
Route::pattern('slug', '[a-z][-a-z0-9]*$');

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::group( [ 'middleware' => [ 'web' ] ], function()
{
    Route::get( '/', 'AngularController@serveApp' );
    Route::get( '/unsupported-browser', 'AngularController@unsupported' );
} );

/**
 * @param \Illuminate\Routing\Router $api
 * @param \Closure $callback
 */
function groupEveryone( $api, $callback )
{
    $api->group( [ 'middleware' => [ 'api', 'language' ] ], $callback );
}

/**
 * @param \Illuminate\Routing\Router $api
 * @param \Closure $callback
 */
function groupAuthenticated( $api, $callback )
{
    $api->group( [ 'middleware' => [ 'api', 'api.auth', 'language' ] ], $callback );
}

/**
 * @param \Illuminate\Routing\Router $api
 * @param \Closure $callback
 */
function groupOrganisation( $api, $callback )
{
    $api->group( [ 'middleware' => [ 'role:organisation-admin|organisation-user' ] ], $callback );
}

/**
 * @param \Illuminate\Routing\Router $api
 * @param \Closure $callback
 */
function groupAdministration( $api, $callback )
{
    $api->group( [ 'middleware' => [ 'role:superadmin|admin' ] ], $callback );
}

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| OFFERS
|--------------------------------------------------------------------------
*/
groupEveryone( $api, function( $api )
{
    $api->get( 'offers', 'Main\OfferController@index' );
    $api->get( 'offers/{id}', 'Main\OfferController@byId' );

    $api->get( 'search/offers', 'Search@offers');
} );

groupAuthenticated( $api, function( $api )
{
    $api->get( 'cms/offers', 'Cms\OfferController@index' );
    $api->get( 'cms/offers/{id}', 'Cms\OfferController@byId' );

    groupOrganisation( $api, function( $api )
    {
        $api->post('cms/offers', 'Cms\OfferController@create');
        $api->put( 'cms/offers/{id}', 'Cms\OfferController@update' );
    } );
} );




/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| CATEGORIES
|--------------------------------------------------------------------------
*/
groupEveryone( $api, function( $api )
{
    $api->get( 'categories', 'Main\CategoryController@index' );
    $api->get( 'categories/{slug}', 'Main\CategoryController@bySlug' );
} );

//
groupAuthenticated( $api, function( $api )
{

} );

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| NGOS
|--------------------------------------------------------------------------
*/
groupEveryone( $api, function( $api )
{
    $api->get( 'providers', 'Main\ProviderController@index' );
    $api->get( 'providers/{id}', 'Main\ProviderController@byId' );
} );

//
groupAuthenticated( $api, function( $api )
{
    $api->get( 'cms/providers', 'Cms\ProviderController@index' );
} );

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| TRANSLATIONS
|--------------------------------------------------------------------------
*/
groupEveryone( $api, function( $api )
{
    $api->get( 'languages/published', 'LanguageController@publishedIndex' );
} );

//
groupAuthenticated( $api, function( $api )
{

} );

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| USER
|--------------------------------------------------------------------------
*/
groupEveryone( $api, function( $api )
{

} );

//
groupAuthenticated( $api, function( $api )
{
    $api->get('cms/users/me', 'Cms\UserController@me');
} );

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| etc
|--------------------------------------------------------------------------
*/
groupEveryone( $api, function( $api )
{
    $api->controller('auth', 'Auth\AuthController');
} );

//
groupAuthenticated( $api, function( $api )
{
    groupOrganisation( $api, function( $api )
    {
        $api->post('images/upload', 'ImageController@uploadImage');
    } );
} );




