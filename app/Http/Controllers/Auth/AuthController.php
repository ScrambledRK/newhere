<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Logic\Address\AddressAPI;
use App\Logic\User\UserRepository;
use App\Ngo;
use App\Role;
use App\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use JWTAuth;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class AuthController extends Controller
{
    protected $userRepository;

    public function __construct( UserRepository $userRepository )
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function postLogin( Request $request )
    {
        $this->validate( $request, [
            'email'    => 'required|email',
            'password' => 'required|min:5'
        ] );

        //
        $credentials = $request->only( 'email', 'password' );

        try
        {
            // verify the credentials and create a token for the user
            if( !$token = JWTAuth::attempt( $credentials ) )
            {
                return response()->error( 'Invalid credentials', 401 );
            }
        }
        catch( \JWTException $e )
        {
            return response()->error( 'Could not create token', 500 );
        }

        //
        $user = Auth::user();

        if( $user->confirmed != 1 )
        {
            return response()->error( 'Your account has not been verified. Did you get mail?', 401 );
        }

        // ----------------------------- //

        $user->load( 'roles' );
        $user->load( 'ngos' );

        // ----------------------------- //

        //
        return response()->success( compact( 'user', 'token' ) );
    }

    //
    public function refreshAuthToken()
    {
        $token = JWTAuth::getToken();

        if(!$token)
            throw new BadRequestHttpException('Token not provided');

        try
        {
            $token = JWTAuth::refresh( $token );
        }
        catch(TokenInvalidException $e )
        {
            throw new AccessDeniedHttpException('The token is invalid');
        }

        //
        return response()->success( compact(  'token' ) );
    }

    /**
     * Standard Registration
     * @param Request $request
     * @return mixed
     */
    public function postRegister( Request $request )
    {
        $this->validate( $request, [
            'name'     => 'required|min:3',
            'email'    => 'required|email|unique:users',
            'phone'    => 'required|min:6',
            'password' => 'required|min:5',
        ] );

        $user = $this->storeAndSendMail( $request->name, $request->email, $request->phone, $request->password );
        $user->attachRole( Role::where( 'name', 'user' )->firstOrFail() );

        $token = JWTAuth::fromUser( $user );

        return response()->success( compact( 'user', 'token' ) );
    }

    /**
     * @param $name
     * @param $email
     * @param $password
     * @return User
     */
    private function storeAndSendMail( $name, $email, $phone, $password )
    {
        $confirmation_code = str_random( 30 );

        $user = new User;
        $user->name = trim( $name );
        $user->email = trim( strtolower( $email ) );
        $user->phone = trim( strtolower( $phone ) );
        $user->password = bcrypt( $password );
        $user->confirmation_code = $confirmation_code;
        $user->save();

        $this->userRepository->verifyMail( $user );

        return $user;
    }

    /**
     * @param $confirmation_code
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function getConfirmation( $confirmation_code )
    {
        if( !$confirmation_code )
        {
            throw new InvalidConfirmationCodeException;
        }

        $user = User::whereConfirmationCode( $confirmation_code )->first();

        if( !$user )
        {
            throw new InvalidConfirmationCodeException;
        }

        $user->confirmed = 1;
        $user->confirmation_code = null;
        $user->save();

        return redirect( '/#/login' );
    }

//    public function getVerify()
//    {
//        $user = User::find( 3 );
//        $user->confirmation_code = str_random( 30 );
//        $user->save();
//
//        $this->userRepository->verifyMail( $user );
//
//        return true;//
//    }

}
