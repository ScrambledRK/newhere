<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Logic\User\UserRepository;
use App\Password;
use App\User;
use Auth;
use Hash;
use Illuminate\Http\Request;

class PasswordResetController extends Controller
{
    /**
     * @param Request $request
     */
    public function resetPassword( UserRepository $userRepository, Request $request )
    {
        $user = Auth::user();
        $token = $userRepository->resetPassword($user);

        return $this->submitNewPassword($request,$token);
    }

    /**
     * @param UserRepository $userRepository
     * @param Request $request
     * @return mixed
     */
    public function requestPasswordResetMail(UserRepository $userRepository, Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
        ]);

        $email = $request->get('email');
        $user = User::where('email', '=', $email)->first();

        if (empty($user)) {
            return response()->error('Ein Benutzer mit dieser Email ist uns nicht bekannt', 422);
        }

        // ------------- //

        $token = $userRepository->resetPassword($user);
        $userRepository->mailResetPassword($user,$token);

        return response()->success(compact('user'));
    }

    /**
     * @param Request $request
     * @param $token
     * @return mixed
     */
    public function submitNewPassword(Request $request, $token)
    {
        $this->validate($request, [
            'password' => 'required|min:5|max:20',
            're_password' => 'required|same:password'
        ]);

        $password = Password::where('token', '=', $token)->first();
        if (empty($password)) {
            return response()->error('Reset token ist ungültig', 422);
        }

        $user = User::where('email', '=', $password->email)->first();
        if (empty($user)) {
            return response()->error('Ein Benutzer mit dieser Email ist uns nicht bekannt', 422);
        }

        // ------------- //

        $user->password = Hash::make($request->get('password'));
        $user->save();
        $password->delete();

        return response()->success(compact('user'));
    }


}
