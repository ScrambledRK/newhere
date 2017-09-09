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
} );

groupAuthenticated( $api, function( $api )
{

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

} );

//
groupAuthenticated( $api, function( $api )
{

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

} );

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| etc
|--------------------------------------------------------------------------
*/
groupEveryone( $api, function( $api )
{

} );

//
groupAuthenticated( $api, function( $api )
{

} );




