<?php

namespace App\Http\Controllers\Cms;

use App\Category;
use App\Filter;
use App\Http\Controllers\Controller;
use App\Logic\Address\AddressAPI;
use App\Ngo;
use App\Offer;
use App\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use phpDocumentor\Reflection\Types\Boolean;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;


class AdminController extends Controller
{

    /**
     * @param Request $request
     * @return mixed
     */
    public function cleanProviders( Request $request )
    {
        $to_ngo = $request->get( 'to_ngo' );
        $result = "clean providers:\n\n";

        //
        $offers = Offer::all();
        $to_move = [];

        foreach( $offers as $off )
        {
            $ngo = Ngo::where( 'id', $off->ngo_id )->first();

            if( is_null($ngo) )
            {
                array_push( $to_move, $off );
                $result .= "\n" . $off->ngo_id . "\t" . $off->id;
            }
        }

        //
        if( is_null($to_ngo) )
        {
            $result .= "\n\n deleting offers ...";

            foreach( $to_move as $off )
            {
                $off->delete();
            }
        }
        else
        {
            $result .= "\n\n reassigning offers to " . $to_ngo . "...";

            foreach( $to_move as $off )
            {
                $off->ngo_id = $to_ngo;
                $off->save();
            }
        }

        //
        return $result;
    }


}
