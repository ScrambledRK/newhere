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
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;


class ProviderController extends Controller
{

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
            $result = Ngo::with( [] ); // only thing I found that returns a builder and not a collection
        }
        else
        {
            $result = Ngo::whereHas( 'users', function( $q ) use ( $user )
            {
                $q->where( 'user_id', $user->id );
            } );
        }

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        if( $request->has( 'enabled' ) )
        {
            $result = $result->where( 'published',
                                      $request->get( 'enabled' ) );
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
                          'street',
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
     * @return mixed
     */
    public function all()
    {
        $result = Ngo::with( [] );

        $count = $result->count();
        $result = $result->get();

        return response()->success( compact( 'result', 'count' ) );
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function byId( $id )
    {
        $result = Ngo::where( 'id', $id )->with(
            [
                'offers',
                'users',
                'image'
            ]
        )->firstOrFail();

        if( !$this->isUserProvider( $result ) )
            throw new AccessDeniedHttpException();

        return response()->json( $result );
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function create( Request $request )
    {
        $this->validate( $request, [
            'organisation' => 'required',
            'description'  => 'max:200'
        ] );

        DB::beginTransaction();

        $provider = new Ngo();
        $provider = $this->populateFromRequest( $request, $provider );
        $provider->save();

        DB::commit();

        return response()->success( compact( 'provider' ) );
    }

    /**
     * @param Request $request
     */
    public function update( Request $request, $id )
    {
        DB::beginTransaction();

        $provider = Ngo::findOrFail( $id );

        //
        if( !$this->isUserProvider( $provider ) )
            throw new AccessDeniedHttpException();

        $provider = $this->populateFromRequest( $request, $provider );
        $provider->save();

        DB::commit();

        return response()->success( compact( [ 'provider' ] ) );
    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function delete( Request $request, $id )
    {
        $provider = Ngo::findOrFail( $id );

        if( !$this->isUserProvider( $provider ) )
            throw new AccessDeniedHttpException();

        $provider->delete();

        return response()->success( compact( 'provider' ) );
    }

    /**
     * @param Request $request
     * @param Ngo $provider
     * @return Ngo
     */
    private function populateFromRequest( Request $request, Ngo $provider )
    {
        $this->validate( $request, [
            'organisation' => 'required',
            'description'  => 'max:200'
        ] );

        // ---------------------------------- //
        // ---------------------------------- //

        //
        $provider->organisation = $request->get( 'organisation' );
        $provider->website = $request->get( 'website' );
        $provider->street = $request->get( 'street' );
        $provider->street_number = $request->get( 'street_number' );
        $provider->zip = $request->get( 'zip' );
        $provider->city = $request->get( 'city' );
        $provider->image_id = $request->get( 'image_id' );
        $provider->contact = $request->get( 'contact' );
        $provider->contact_email = $request->get( 'contact_email' );
        $provider->contact_phone = $request->get( 'contact_phone' );
        $provider->published = $request->get( 'published' );

        // ---------------------------------- //
        // ---------------------------------- //

        //
        $hasAddress = $request->has( 'street' )
            && $request->has( 'street_number' )
            && $request->has( 'zip' );

        if( $hasAddress )
        {
            $hasCoordinates = $request->has( 'latitude' )
                && $request->has( 'longitude' );

            if( $hasCoordinates )
            {
                $coordinates = [
                    $request->get( 'latitude' ),
                    $request->get( 'longitude' )
                ];
            }
            else
            {
                $addressApi = new AddressAPI();

                $coordinates = $addressApi->getCoordinates(
                    $request->get( 'street' ),
                    $request->get( 'street_number' ),
                    $request->get( 'zip' ) );
            }

            $provider->street = $request->get( 'street' );
            $provider->street_number = $request->get( 'street_number' );
            $provider->zip = $request->get( 'zip' );
            $provider->city = $request->get( 'city' );
            $provider->latitude = $coordinates[ 0 ];
            $provider->longitude = $coordinates[ 1 ];
        }
        else
        {
            $provider->street = null;
            $provider->street_number = null;
            $provider->zip = null;
            $provider->city = null;
            $provider->latitude = null;
            $provider->longitude = null;
        }

        // ---------------------------------- //
        // ---------------------------------- //

        //
        $hasDescriptionChanged  = $provider->description   != $request->get( 'description' );

        if( $hasDescriptionChanged )
        {
            $locale = $request->header("Language", "de");

            $provider->translations()->where("locale","!=", $locale)
                ->update( [ 'version' => 0 ] );

            $provider->translations()->where("locale","=", $locale)
                ->update( [ 'version' => 2 ] );
        }

        $provider->description = $request->get( 'description' );

        // ---------------------------------- //
        // ---------------------------------- //

        return $provider;
    }

    /**
     * @param Ngo $provider
     * @return bool
     */
    private function isUserProvider( $provider )
    {
        $user = Auth::user();

        if( $this->isUserAdmin( $user ) )
            return true;

        //
        $user->load( 'ngos' );
        $ngos = $user->getRelations()[ "ngos" ];

        foreach( $ngos as $ngo )
        {
            if( $ngo->getAttribute( "id" ) === $provider->getAttribute( "id" ) )
                return true;
        }

        return false;
    }
}
