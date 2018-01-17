<?php

namespace App\Http\Controllers;

use App\Ngo;
use Auth;
use Dingo\Api\Exception\ValidationHttpException;
use Dingo\Api\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Fixes dingo/api form request validation:
     * https://github.com/dingo/api/wiki/Errors-And-Error-Responses#form-requests
     */
    public function validate( Request $request, array $rules, array $messages = [], array $customAttributes = [] )
    {
        $validator = $this->getValidationFactory()->make( $request->all(), $rules, $messages, $customAttributes );

        if( $validator->fails() )
        {
            throw new ValidationHttpException( $validator->errors() );
        }
    }

    /**
     * @param $request
     * @param $result
     * @return mixed
     */
    public function paginate( \Illuminate\Http\Request $request, $result )
    {
        //
        $result = $this->order( $request, $result );
        $result = $this->limit( $request, $result );

        return $result;
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param $result
     * @return static
     */
    public function order( \Illuminate\Http\Request $request, $result )
    {
        if( $request->has( 'order' ) && $request->get( 'order' ) != null)
        {
            $order = $request->get( 'order' );
            $dir = 'DESC';

            if( substr( $order, 0, 1 ) == '-' )
            {
                $dir = 'ASC';
                $order = substr( $order, 1 );
            }

            if( $result instanceof Collection )
            {
                if( $dir === 'DESC')
                {
                    $result = $result->sortByDesc( $order );
                }
                else
                {
                    $result = $result->sortBy( $order );
                }
            }
            else
            {
                $result = $result->orderBy( $order, $dir );
            }
        }

        return $result;
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param $result
     * @return static
     */
    public function limit( \Illuminate\Http\Request $request, $result )
    {
        if( $request->has( 'limit' ) && $request->has( 'page' ) )
        {
            $numElements = $request->get( 'limit' );
            $startElement = ( $request->get( 'page' ) - 1 ) * $numElements;

            if( $result instanceof Collection )
            {

                $result = $result->splice( $startElement, $numElements );
            }
            else
            {
                $result = $result->take( $numElements );
                $result = $result->skip( $startElement );
            }
        }

        return $result;
    }

    /**
     * ngos the user is part of; except admins who are "part of" all ngos
     * @return mixed
     */
    public function isUserAdmin( $user )
    {
        if( $user == null )
            $user = Auth::user();

        $user->load( 'roles' );

        //
        foreach ($user->getRelations()["roles"] as $role)
        {
            $name = $role->getAttribute("name");

            if( $name === "admin" || $name === "superadmin" )
                return true;
        }

        return false;
    }

    /**
     * @param $value
     * @return bool
     */
    protected function getBoolean($value)
    {
        if($value === 'true' || $value === 'TRUE')
            return true;

        if($value === 'false' || $value === 'FALSE')
            return false;

        return $value;
    }
}
