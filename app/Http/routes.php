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

Route::group(['middleware' => ['web']], function () {

    Route::get('/', 'AngularController@serveApp');

    Route::get('/unsupported-browser', 'AngularController@unsupported');

});

$api->group(['middleware' => ['api']], function ($api) {
    /**
     * @var \Dingo\Api\Routing\Router $api
     */
    $api->controller('auth', 'Auth\AuthController');

    $api->get('users', 'Cms\UserController@index');
    $api->get('users/role/{role}', 'Cms\UserController@byRole');
    $api->get('users/ngo/{id}', 'Cms\UserController@byNgo');
    $api->get('users/{id}', 'Cms\UserController@show');
    $api->post('users', 'Cms\UserController@create');
    $api->put('users/{id}', 'Cms\UserController@update');

});

//protected routes with JWT (must be logged in)
$api->group(['middleware' => ['api', 'api.auth']], function ($api) {
    $api->get('languages', 'Cms\LanguageController@index');
    $api->get('languages/published', 'Cms\LanguageController@published');
    $api->put('languages/{id}', 'Cms\LanguageController@update');

    $api->get('filter', 'Cms\FilterController@index');

    $api->get('categories', 'Cms\CategoryController@index');
    $api->get('categories/{id}', ['uses' => 'Cms\CategoryController@show']);
    $api->post('categories', 'Cms\CategoryController@create');
    $api->put('categories/{id}', ['uses' => 'Cms\CategoryController@update']);
    $api->put('categories/{id}/toggleEnabled', 'Cms\CategoryController@toggleEnabled');

    $api->get('roles', 'Cms\RoleController@index');


});
