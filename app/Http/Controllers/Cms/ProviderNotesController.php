<?php

namespace App\Http\Controllers\Cms;

use App\Category;
use App\Filter;
use App\Http\Controllers\Controller;
use App\Logic\Address\AddressAPI;
use App\Ngo;
use App\NgoNotes;
use App\Offer;
use App\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;


class ProviderNotesController extends Controller
{


    /**
     * @param Request $request
     * @return mixed
     */
    public function index( Request $request )
    {
        if( !$this->isUserAdmin( Auth::user() ) )
            throw new AccessDeniedHttpException();

        $result = Ngo::with( [ "notes", "notes.user", "users", "users.pendings", "users.roles" ] )
            ->select('ngos.*')
            ->leftJoin("ngo_notes","ngos.note_id", "=", "ngo_notes.id" );

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        if( $request->has( 'enabled' ) )
        {
            if( $request->get( 'enabled' ) == "true" )
            {
                $result = $result->where( 'checked', true );
            }
            else
            {
                $result = $result->where( 'checked', false )
                                 ->orWhere( 'note_id', null );
            }
        }

        //
        if( $request->has( 'title' ) )
        {
            $toSearch = $request->get( 'title' );

            $result = $result->where( function( $query ) use ( $toSearch )
            {
                $query->where(
                    'organisation',
                    'ilike',
                    '%' . $toSearch . '%'
                )
                      ->orWhere(
                          'notes.notes',
                          'ilike',
                          '%' . $toSearch . '%'
                      );
            } );
        }

        //
        if( $request->has( 'withCounts' ) )
        {
            $result->withCount( "offers" );
            $result->withCount( "users" );
        }

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
    public function update( Request $request, $id )
    {
        if( !$this->isUserAdmin( Auth::user() ) )
            throw new AccessDeniedHttpException();

        //
        $provider = Ngo::with( [ "notes" ] )->findOrFail( $id );

        //
        if( $request->has( 'contact' ) )
            $provider->contact = $request->get( 'contact' );

        if( $request->has( 'contact_email' ) )
            $provider->contact_email = $request->get( 'contact_email' );

        if( $request->has( 'contact_phone' ) )
            $provider->contact_phone = $request->get( 'contact_phone' );

        //
        $note = null;

        if( $provider->note_id )
        {
            $note = NgoNotes::firstOrCreate( [ 'id' => $provider->note_id ] );
        }
        else
        {
            $note = new NgoNotes();
        }

        // ------------------------------------- //
        // ------------------------------------- //

        DB::beginTransaction();

        //
        $isChecked = false;

        if( $request->has( 'note_checked' ) )
            $isChecked = $request->get( 'note_checked' );

        $note->checked = $isChecked;
        $note->notes = $request->get( 'note_content' );
        $note->user_id = Auth::user()->id; //$request->get( 'user_id' );
        $note->save();

        $provider->note_id = $note->id;
        $provider->save();

        DB::commit();

        // ------------------------------------- //
        // ------------------------------------- //

        $provider = Ngo::with( [ "notes", "notes.user", "users", "users.pendings", "users.roles" ] );

        $provider->withCount( "offers" );
        $provider->withCount( "users" );

        $provider = $provider->findOrFail( $id );

        //
        return response()->success( compact( 'provider' ) );
    }

}
