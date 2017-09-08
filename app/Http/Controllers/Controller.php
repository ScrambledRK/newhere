<?php

namespace App\Http\Controllers;

use Dingo\Api\Exception\ValidationHttpException;
use Dingo\Api\Http\Request;
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
        if( $request->has( 'order' ) )
        {
            $order = $request->get( 'order' );
            $dir = 'DESC';

            if( substr( $order, 0, 1 ) == '-' )
            {
                $dir = 'ASC';
                $order = substr( $order, 1 );
            }

            $result = $result->orderBy( $order, $dir );
        }

        //
        if( $request->has( 'limit' ) )
        {
            $result = $result->take( $request->get( 'limit' ) );
        }

        //
        if( $request->has( 'page' ) )
        {
            $result = $result->skip( ( $request->get( 'page' ) - 1 ) * $request->get( 'limit' ) );
        }

        return $result;
    }

}
