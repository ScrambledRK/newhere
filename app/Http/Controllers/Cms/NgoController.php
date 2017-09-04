<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Logic\Address\AddressAPI;
use App\Ngo;
use App\Role;
use App\User;
use Illuminate\Http\Request;
use Auth;
use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use Mail;
use App\Logic\Mailers\UserMailer;

class NgoController extends Controller
{

    /**
     * @return mixed
     */
    public function index()
    {
        $ngos = Ngo::with(
            [
                'image',
                'users',
                'offers'
            ]
        )->get();

        return response()->success( compact( 'ngos' ) );
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show( $id )
    {
        $ngo = Ngo::findOrFail( $id )
                  ->load( [ 'image', 'offers' ] );

        return response()->json( $ngo );
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function create( Request $request )
    {
        $useCmsAccount = $request->has( 'useCmsAccount' );

        if( !$useCmsAccount )
        {
            $this->validate( $request, [
                'organisation'  => 'required',
                'email'         => 'required|email|unique:users',
                'password'      => 'required|min:5',
                'description'   => 'max:200',
                'street'        => 'required',
                'street_number' => 'required',
                'city'          => 'required',
                'zip'           => 'required'
            ] );
        } else
        {
            $this->validate( $request, [
                'organisation' => 'required',
                'description'  => 'max:200'
            ] );
        }

        // ---------------------------------- //
        // ---------------------------------- //

        DB::beginTransaction();

        $ngo = new Ngo();
        $ngo = $this->populateFromRequest( $request, $ngo );
        $ngo->save();

        // ---------------------------------- //
        // ---------------------------------- //

        if( $useCmsAccount )
        {
            $ngoUser = Auth::user();
        }
        else
        {
            $ngoUser = $this->storeAndSendMail( $request->get( 'organisation' ),
                                                $request->email,
                                                $request->password
            );

            $organisationRole = Role::where( 'name', 'organisation-admin' )->firstOrFail();
            $ngoUser->attachRole( $organisationRole );
        }

        $ngo->users()->attach( $ngoUser );

        // ---------------------------------- //
        // ---------------------------------- //

        DB::commit();

        return response()->success( compact( 'ngo' ) );
    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function update( Request $request, $id )
    {
        DB::beginTransaction();

        $ngo = Ngo::findOrFail( (int)$id );
        $ngo = $this->populateFromRequest( $request, $ngo );
        $ngo->save();

        DB::commit();

        return response()->success( compact( 'ngo' ) );
    }

    /**
     * @param Request $request
     * @param Ngo $ngo
     * @return Ngo
     */
    private function populateFromRequest( Request $request, Ngo $ngo  )
    {
        $this->validate( $request, [
            'organisation' => 'required',
            'description'  => 'max:200'
        ] );

        // ---------------------------------- //
        // ---------------------------------- //

        $ngo->organisation  = $request->get( 'organisation' );
        $ngo->website       = $request->get( 'website' );
        $ngo->street        = $request->get( 'street' );
        $ngo->street_number = $request->get( 'street_number' );
        $ngo->zip           = $request->get( 'zip' );
        $ngo->city          = $request->get( 'city' );
        $ngo->image_id      = $request->get( 'image_id' );
        $ngo->contact       = $request->get( 'contact' );
        $ngo->contact_email = $request->get( 'contact_email' );
        $ngo->contact_phone = $request->get( 'contact_phone' );

        //
        $hasAddress = $request->has( 'street' )
            && $request->has( 'street_number' )
            && $request->has( 'zip' );

        if( $hasAddress )
        {
            $addressApi = new AddressAPI();
            $coordinates = $addressApi->getCoordinates( $request->get( 'street' ),
                                                        $request->get( 'street_number' ),
                                                        $request->get( 'zip' )
            );

            $ngo->latitude = $coordinates[ 0 ];
            $ngo->longitude = $coordinates[ 1 ];
        }

        //
        if( $request->has( 'description' ) )
        {
            $locale = $request->get( 'language' );
            $ngo->translateOrNew( $locale )->description = $request->get( 'description' );
        }

        return $ngo;
    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function setIsPublished( Request $request, $id )
    {
        $this->validate( $request, [
            'published' => 'required'
        ] );

        // ---------------------------------- //
        // ---------------------------------- //

        $ngo = Ngo::findOrFail( (int)$id )->load( [ 'offers' ] );
        $modified = false;

        if( isset( $request->published ) )
        {
            $ngo->published = (bool)$request->published;
            $modified = true;
        }

        if( $modified )
        {
            $ngo->save();
        }

        return response()->success( compact( 'ngo' ) );
    }

    /**
     * @param Request $request
     * @param $ids
     * @return mixed
     */
    public function bulkAssign( Request $request, $ids )
    {
        $ngosQ = Ngo::whereIn( 'id', explode( ',', $ids ) );
        $ngos = $ngosQ->get();

        $updatedRows = $ngosQ->update(
            [ $request->get( 'field' ) => $request->get( 'value' ) ]
        );

        return response()->success( compact( 'ngos', 'updatedRows' ) );
    }

    /**
     * @param $ids
     * @return mixed
     */
    public function bulkRemove( $ids )
    {
        $ngosQ = Ngo::whereIn( 'id', explode( ',', $ids ) );
        $ngos = $ngosQ->get();

        $deletedRows = $ngosQ->delete();

        return response()->success( compact( 'ngos', 'deletedRows' ) );
    }

    /**
     * @param $name
     * @param $email
     * @param $password
     * @return User
     */
    private function storeAndSendMail( $name, $email, $password )
    {
        $confirmation_code = str_random( 30 );

        $user = new User;
        $user->name = trim( $name );
        $user->email = trim( strtolower( $email ) );
        $user->password = bcrypt( $password );
        $user->confirmation_code = $confirmation_code;
        $user->save();

        $mailer = new UserMailer;
        $mailer->verify( $user );

        return $user;
    }
}
