<?php

namespace App\Http\Controllers;
use App\Logic\Address\AddressAPI;

class AutoComplete extends Controller
{
    /**
     * @param $search
     * @return \Illuminate\Http\JsonResponse
     */
    public function address( $search )
    {
        $addressApi = new AddressAPI();
        $returnArray = $addressApi->getAddressSuggestions( $search );

        return response()->json( $returnArray );
    }
}