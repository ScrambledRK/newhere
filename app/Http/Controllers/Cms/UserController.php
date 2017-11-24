<?php

namespace App\Http\Controllers\Cms;

use App\PendingRequest;
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

        $user->load( "roles" );
        $user->load( "ngos" );
        $user->load( "languages" );
        $user->load( ['pendings' => function ($query) {
            $query->with([ "ngo", "role" ]);
        }]);

        return response()->json( $user );
    }

    //
    public function byId( $id )
    {
        $user = User::where( 'id', $id )->with(
            [
                'roles',
                'ngos',
                'languages',
                'pendings',
                'pendings.ngo',
                'pendings.role'
            ]
        )->firstOrFail();

        return response()->json( $user );
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function index( Request $request )
    {
        $user = Auth::user();
        $result = null;

        if( $this->isUserAdmin( $user ) )
        {
            $result = User::with( [ "ngos", "pendings", "roles" ] ); // only thing I found that returns a builder and not a collection
        }
        else
        {
            $result = User::with( [ "ngos", "roles" ] )
                          ->whereHas( "ngos.users",
                              function( $query ) use ( $user )
                              {
                                  $query->where( "user_id", $user->id );
                              } );
        }

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        if( $request->has( 'ngo_id' ) )
        {
            $result = $result->whereHas( "ngos",
                function( $query ) use ( $request )
                {
                    $query->where( "ngo_id", $request->get( 'ngo_id' ) );
                } );
        }

        //
        if( $request->has( 'enabled' ) )
        {
            $result = $result->where( 'confirmed',
                                      $request->get( 'enabled' ) );
        }

        //
        if( $request->has( 'title' ) )
        {
            $toSearch = $request->get( 'title' );

            $result = $result->where( function( $query ) use ( $toSearch )
            {
                $query->where(
                    'name',
                    'ilike',
                    '%' . $toSearch . '%'
                )->orWhere( function( $query ) use ( $toSearch )
                {
                    $query->where(
                        'email',
                        'ilike',
                        '%' . $toSearch . '%'
                    );
                } );
            } );
        }

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
     * @param Request $request
     * @return mixed
     */
    public function roles( Request $request )
    {
        $result = Role::with( [] );

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
     * @param Request $request
     * @return mixed
     */
    public function create( Request $request )
    {
        DB::beginTransaction();

        $user = new User;
        $user = $this->populateFromRequest( $request, $user );
        $user = $this->passwordFromRequest( $request, $user );
        $user->save();

        $user = $this->relationFromRequest( $request, $user );
        $user->save();

        DB::commit();

        return response()->success( compact( 'user' ) );

    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function update( Request $request, $id )
    {
        DB::beginTransaction();

        $user = User::findOrFail( $id );
        $user = $this->populateFromRequest( $request, $user );
        $user = $this->relationFromRequest( $request, $user );
        $user->save();

        DB::commit();

        return response()->success( compact( [ 'user' ] ) );
    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function delete( Request $request, $id )
    {
        $user = User::findOrFail( $id );
        $user->delete();

        return response()->success( compact( 'user' ) );
    }

    /**
     * @param Request $request
     * @param User $user
     * @return User
     */
    private function populateFromRequest( Request $request, User $user )
    {
        $this->validate( $request, [
            'email'     => 'required|email',
            'name'      => 'required|min:3|max:255',
            'confirmed' => 'required'
        ] );

        // ---------------------------------- //
        // ---------------------------------- //

        $user->name = trim( $request->get( 'name' ) );
        $user->email = trim( strtolower( $request->get( 'email' ) ) );
        $user->confirmed = $request->get( 'confirmed' );

        // ---------------------------------- //
        // ---------------------------------- //

        //
        return $user;
    }

    /**
     * @param Request $request
     * @param User $user
     * @return User
     */
    private function relationFromRequest( Request $request, User $user )
    {
        //
        if( $request->has( 'roles' ) )
        {
            $user->roles()->detach();

            foreach( $request->get( 'roles' ) as $role )
            {
                $role = Role::findOrFail( $role[ 'id' ] );
                $user->roles()->attach( $role );
            }
        }

        //
        if( $request->has( 'ngos' ) )
        {
            $user->ngos()->detach();

            foreach( $request->get( 'ngos' ) as $ngo )
            {
                $ngo = Ngo::findOrFail( $ngo[ 'id' ] );
                $user->ngos()->attach( $ngo );
            }
        }

        //
        if( $request->has( 'languages' ) )
        {
            $user->languages()->detach();

            foreach( $request->get( 'languages' ) as $language )
            {
                $language = Language::where( 'language', $language[ 'language' ] )->firstOrFail();
                $user->languages()->attach( $language );
            }
        }

        // ---------------------------------- //
        // ---------------------------------- //

        //
        return $user;
    }

    /**
     * @param Request $request
     * @param User $user
     * @return User
     */
    private function passwordFromRequest( Request $request, User $user )
    {
        $this->validate( $request, [
            'confirmed'   => 'required',
            'password'    => 'required|min:5',
            're_password' => 'required|min:5',
            'roles'       => 'required'
        ] );

        //
        if( $request->get( 'password' ) != $request->get( 're_password' ) )
            return response()->error( 'Passwords do not match!', 422 );

        // ---------------------------------- //
        // ---------------------------------- //

        //
        $user->password = bcrypt( $request->get( 'password' ) );

        if( !$request->get( 'confirmed' ) )
            $user->confirmation_code = str_random( 30 );

        return $user;
    }
}