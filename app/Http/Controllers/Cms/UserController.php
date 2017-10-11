<?php

namespace App\Http\Controllers\Cms;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests;
use App\User;
use App\Role;
use App\Ngo;
use App\Language;
use Auth;

use DB;

class UserController extends Controller
{
    //
    public function me()
    {
        $user = Auth::user();

        $user->load("roles");
        $user->load("ngos");

        return response()->json( $user );
    }
}