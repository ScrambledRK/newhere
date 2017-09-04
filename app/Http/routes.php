<?php

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
Route::group(['middleware' => ['web']], function ()
{
    Route::get('/', 'AngularController@serveApp');
    Route::get('/unsupported-browser', 'AngularController@unsupported');
});

/**
 * @param \Illuminate\Routing\Router $api
 * @param \Closure $callback
 */
function groupEveryone($api, $callback)
{
    $api->group(['middleware' => ['api', 'language']], $callback);
}

/**
 * @param \Illuminate\Routing\Router $api
 * @param \Closure $callback
 */
function groupAuthenticated($api, $callback)
{
    $api->group(['middleware' => ['api', 'api.auth', 'language']], $callback);
}

/**
 * @param \Illuminate\Routing\Router $api
 * @param \Closure $callback
 */
function groupOrganisation($api, $callback)
{
    $api->group(['middleware' => ['role:organisation-admin|organisation-user']], $callback);
}

/**
 * @param \Illuminate\Routing\Router $api
 * @param \Closure $callback
 */
function groupAdministration($api, $callback)
{
    $api->group(['middleware' => ['role:superadmin|admin']], $callback);
}

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| OFFERS
|--------------------------------------------------------------------------
*/
groupEveryone($api, function ($api)
{
    $api->get('offers', 'Cms\OfferController@index');
    $api->get('offers/{id}', ['uses' => 'Cms\OfferController@show'])->where('id', '[0-9]+');

    $api->get('offers/search', 'Search@offer');
    $api->get('offer/autocomplete/{search}', 'AutoComplete@address');
});

groupAuthenticated($api, function ($api)
{
    $api->post('offers', 'Cms\OfferController@create');
    $api->put('offers/{id}', 'Cms\OfferController@update');
    $api->delete('offers/{id}', 'Cms\OfferController@bulkRemove');

    $api->get('offers/stats', 'Statistics@offers');
    $api->get('offer-translations/stats', 'Cms\OfferTranslationController@stats');

    //
    groupOrganisation($api, function ($api)
    {
        $api->put('offers/{id}/toggleEnabled', 'Cms\OfferController@setIsEnabled');
    });

    //
    groupAdministration($api, function ($api)
    {
        $api->patch('offers/{ids}', 'Cms\OfferController@bulkAssign');
    });
});

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| NGOS
|--------------------------------------------------------------------------
*/
groupEveryone($api, function ($api)
{
    $api->get('ngos', 'Cms\NgoController@index');
    $api->get('ngo/{id}', 'Cms\NgoController@show');
});

//
groupAuthenticated($api, function ($api)
{
    $api->get('ngos/stats', 'Cms\NgoController@stats');
    $api->get('ngos/my', 'Cms\NgoController@my');
    $api->put('ngos/my/{id}', 'Cms\NgoController@update');

    //
    groupOrganisation($api, function ($api)
    {

    });

    //
    groupAdministration($api, function ($api)
    {
        $api->post('ngos', 'Cms\NgoController@create');
        $api->put('ngos/{id}', 'Cms\NgoController@update');
        $api->put('ngos/{id}/togglePublished', 'Cms\NgoController@setIsPublished');
        $api->patch('ngos/{ids}', 'Cms\NgoController@bulkAssign');
        $api->delete('ngos/{id}', 'Cms\NgoController@bulkRemove');
    });
});

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| TRANSLATIONS
|--------------------------------------------------------------------------
*/
groupEveryone($api, function ($api)
{
    $api->get('languages/published', 'Cms\LanguageController@publishedIndex');
});

//
groupAuthenticated($api, function ($api)
{
    $api->get('offer-translations', 'Cms\OfferTranslationController@index');
    $api->get('offer-translations/untranslated', 'Cms\OfferTranslationController@untranslatedIndex');
    $api->put('offer-translations/{id}', ['uses' => 'Cms\OfferTranslationController@translate'])->where('id', '[0-9]+');

    $api->get('category-translations', 'Cms\CategoryTranslationController@index');
    $api->get('category-translations/untranslated', 'Cms\CategoryTranslationController@untranslatedIndex');
    $api->put('category-translations/{id}', 'Cms\CategoryTranslationController@translate');

    $api->get('ngo-translations', 'Cms\NgoTranslationController@index');
    $api->get('ngo-translations/untranslated', 'Cms\NgoTranslationController@untranslatedIndex');
    $api->put('ngo-translations/{id}', 'Cms\NgoTranslationController@translate');

    $api->get('filter-translations', 'Cms\FilterTranslationController@index');
    $api->get('filter-translations/untranslated', 'Cms\FilterTranslationController@untranslatedIndex');
    $api->put('filter-translations/{id}', 'Cms\FilterTranslationController@translate');

    $api->get('languages/enabled', 'Cms\LanguageController@enabledIndex');
    $api->get('languages/default', 'Cms\LanguageController@defaultLanguage');

    //
    groupOrganisation($api, function ($api)
    {

    });

    //
    groupAdministration($api, function ($api)
    {
        $api->get('languages', 'Cms\LanguageController@index');
        $api->put('languages/{id}', 'Cms\LanguageController@update');
    });
});

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| USER
|--------------------------------------------------------------------------
*/
groupEveryone($api, function ($api)
{
    $api->post('password', 'Auth\PasswordResetController@requestPasswordResetMail');
    $api->post('password/{token}', 'Auth\PasswordResetController@submitNewPassword');
});

//
groupAuthenticated($api, function ($api)
{
    $api->get('users/me', 'Cms\UserController@me');
    $api->post('profile/password', 'Auth\PasswordResetController@resetPassword');

    //
    groupOrganisation($api, function ($api)
    {
        $api->post('users', 'Cms\UserController@create');
        $api->delete('users/{id}', 'Cms\UserController@bulkRemove');
        $api->get('ngoUsers', 'Cms\UserController@byNgo');
        $api->post('ngoUsers', 'Cms\UserController@createNgoUser');
        $api->put('ngoUsers/{id}/toggleAdmin', 'Cms\UserController@toggleAdmin');
    });

    //
    groupAdministration($api, function ($api)
    {
        $api->get('users', 'Cms\UserController@index');
        $api->get('users/role/{role}', 'Cms\UserController@byRole');
        $api->get('users/{id}', 'Cms\UserController@show');
        $api->put('users/{id}', 'Cms\UserController@update');

        $api->get('roles', 'Cms\RoleController@index');
    });
});

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| etc
|--------------------------------------------------------------------------
*/
groupEveryone($api, function ($api)
{
    $api->controller('auth', 'Auth\AuthController');

    $api->get('images/upload', 'ImageController@test');
    $api->post('images/upload', 'ImageController@uploadImage');

    $api->get('categories', 'Cms\CategoryController@index');
    $api->get('categories/{id}', ['uses' => 'Cms\CategoryController@show'])->where('id', '[0-9]+');
    $api->get('categories/{slug}', ['uses' => 'Cms\CategoryController@bySlug'])->where(['slug' => '[a-z][-a-z0-9]*$']);
    $api->get('categories/{id}/offers', ['uses' => 'Cms\CategoryController@offers']);

    $api->get('filters', 'Cms\FilterController@index');
});

//
groupAuthenticated($api, function ($api)
{
    $api->get('dashboard/widgets', 'Cms\DashboardController@widgets');
    $api->get('dashboard', 'Cms\DashboardController@userWidgets');
    $api->post('dashboard', 'Cms\DashboardController@saveUserWidget');

    //
    groupOrganisation($api, function ($api)
    {

    });

    //
    groupAdministration($api, function ($api)
    {
        $api->post('categories', 'Cms\CategoryController@create');
        $api->put('categories/{id}', ['uses' => 'Cms\CategoryController@update']);
        $api->put('categories/{id}/toggleEnabled', 'Cms\CategoryController@toggleEnabled');
        $api->put('categories/{id}/move', 'Cms\CategoryController@move');

        $api->put('filters/{id}/toggleEnabled', 'Cms\FilterController@toggleEnabled');
        $api->get('filters/{id}', ['uses' => 'Cms\FilterController@show']);
        $api->post('filters', 'Cms\FilterController@create');
        $api->put('filters/{id}', ['uses' => 'Cms\FilterController@update']);
    });
});




