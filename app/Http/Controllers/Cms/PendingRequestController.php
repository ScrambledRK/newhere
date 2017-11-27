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

class PendingRequestController extends Controller
{
    /**
     * @param Request $request
     */
    public function index( Request $request )
    {
        $user = Auth::user();
        $result = PendingRequest::with( [ "ngo", "role", "user" ] );

        if( !$this->isUserAdmin( $user ) )
            $result = $result->where( "user_id", $user->id );

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

        $pending = new PendingRequest;
        $pending = $this->populateFromRequest( $request, $pending );
        $pending->save();

        DB::commit();

        return response()->success( compact( 'pending' ) );

    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function update( Request $request, $id )
    {
        DB::beginTransaction();

        $pending = PendingRequest::findOrFail( $id );
        $pending = $this->populateFromRequest( $request, $pending );
        $pending->save();

        DB::commit();

        return response()->success( compact( [ 'pending' ] ) );
    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function delete( Request $request, $id )
    {
        $pending = PendingRequest::findOrFail( $id );
        $pending->delete();

        return response()->success( compact( 'pending' ) );
    }

    /**
     * @param Request $request
     * @param PendingRequest $pending
     * @return PendingRequest
     */
    private function populateFromRequest( Request $request, PendingRequest $pending )
    {
        // validate

        // ---------------------------------- //
        // ---------------------------------- //

        $user = Auth::user();

        //
        $pending->user_id = $user->id;
        $pending->role_id = $request->get( 'role_id' );
        $pending->ngo_id = $request->get( 'ngo_id' );
        $pending->type = $request->get( 'type' );

        // ---------------------------------- //
        // ---------------------------------- //

        $pending->load( "ngo" );
        $pending->load( "role" );
        $pending->load( "user" );

        //
        return $pending;
    }

}