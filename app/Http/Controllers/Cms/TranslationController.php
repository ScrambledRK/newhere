<?php

namespace App\Http\Controllers\Cms;

use App\Offer;
use App\OfferTranslation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests;
use App\User;
use App\Role;
use App\Ngo;
use App\Language;
use Auth;

use DB;

class TranslationController extends Controller
{

    /**
     * @param Request $request
     * @return mixed
     */
    public function index( Request $request )
    {
        $result = Offer::with(["translations"]);

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        $count = $result->count();
        $result = $this->paginate( $request, $result );

        //
        $result = $result->get();

        // ------------------------------------------- //
        // ------------------------------------------- //

        return response()->success( compact( 'result', 'count' ) );
    }

    /**
     * @return array
     */
    private function loadLanguages()
    {
        $user = Auth::user();
        $user->load( 'roles' );

        $allLanguages = true;

        //
        foreach( $user->roles as $role )
        {
            if( in_array( $role->name, [ 'moderator' ] ) )
            {
                $allLanguages = false;
                break;
            }
        }

        //
        $decreaseCount = 0;

        if( $allLanguages )
        {
            $languages = \App\Language::where( 'enabled', true )->get();
            $decreaseCount = 1;
        }
        else
        {
            $languages = $user->languages()->get();

            foreach( $languages as $language )
            {
                if( $language->default_language )
                {
                    $decreaseCount = 1;
                    break;
                }
            }
        }

        //
        return [
            $languages,
            $languages->count() - $decreaseCount
        ];
    }
}