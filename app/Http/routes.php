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
    $api->group( [ 'middleware' => [ 'role:organisation-admin|organisation-user|superadmin|admin' ] ], $callback );
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
        $api->delete( 'cms/offers/{id}', 'Cms\OfferController@delete' );
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
    $api->get( 'cms/categories/{slug}', 'Cms\CategoryController@bySlug' );
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
    $api->get( 'cms/providers/all', 'Cms\ProviderController@all' );
    $api->get( 'cms/providers/{id}', 'Cms\ProviderController@byId' );

    // normal users can create a new one
    $api->post('cms/providers', 'Cms\ProviderController@create');

    groupOrganisation( $api, function( $api )
    {
        $api->put( 'cms/providers/{id}', 'Cms\ProviderController@update' );
        $api->delete( 'cms/providers/{id}', 'Cms\ProviderController@delete' );
    } );
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
    $api->get( 'cms/translations/{slug}', 'Cms\TranslationController@index' );
    $api->put( 'cms/translations/{slug}/{id}', 'Cms\TranslationController@translate' );
} );

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| USER
|--------------------------------------------------------------------------
*/
groupEveryone( $api, function( $api )
{
    $api->post('password', 'Auth\PasswordResetController@requestPasswordResetMail');
    $api->post('password/{token}', 'Auth\PasswordResetController@submitNewPassword');
} );

//
groupAuthenticated( $api, function( $api )
{
    $api->get('cms/users/me', 'Cms\UserController@me');
    $api->get( 'cms/users', 'Cms\UserController@index' );
    $api->get( 'cms/roles', 'Cms\UserController@roles' );

    $api->get( 'cms/users/pending', 'Cms\PendingRequestController@index' );
    $api->post( 'cms/users/pending', 'Cms\PendingRequestController@create' );
    $api->delete( 'cms/users/pending/{id}', 'Cms\PendingRequestController@delete' );

    $api->post('profile/password', 'Auth\PasswordResetController@resetPassword');

    //
    groupAdministration($api, function ($api)
    {
        $api->get('cms/users/{id}', 'Cms\UserController@byId');
        $api->post('cms/users', 'Cms\UserController@create');
        $api->put( 'cms/users/{id}', 'Cms\UserController@update' );
        $api->delete( 'cms/users/{id}', 'Cms\UserController@delete' );
    } );
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
    $api->get( 'search/address/{search}', 'Search@address');
} );

//
groupAuthenticated( $api, function( $api )
{
    $api->get( 'cms/filters', 'Cms\FilterController@index' );

    groupOrganisation( $api, function( $api )
    {
        $api->post('images/upload', 'ImageController@uploadImage');
    } );
} );




