<?php

namespace App\Logic\Address;

use GuzzleHttp\Client;use Illuminate\Support\Facades\Config;

/**
 * Class AddressAPI
 *
 * @package App\Logic\Address
 * @author  : Konrad Pozniak
 *
 * Helper Class to wrap the calls to the Mapzen geocoding api in convenient methods
 *
 */
class AddressAPI
{
    /**
     * Returns the coordinates of the specified address, or null if an error occurred
     *
     * @param $street
     * @param $streetnumber
     * @param $zip
     *
     * @return null
     */
    public function getCoordinates( $street, $streetnumber, $zip )
    {
        $json = $this->query( $street . ' ' . $streetnumber . ', ' . $zip );

        if( $json === null )
        {
            return null;
        }

        try
        {
            $feature = $json[ 'features' ][ 0 ];

            return $feature[ 'geometry' ][ 'coordinates' ];
        }
        catch( \Exception $error )
        {
            //;
        }

        return null;
    }

    /**
     * @param $input
     *
     * @return array
     * Returns an array of address suggestions, or an empty array if an error occurs or no suggestions were found
     */
    public function getAddressSuggestions( $input )
    {
        $returnArray = [];

        $json = $this->query( $input );

        if( $json == null )
        {
            return $returnArray;
        }

        $features = $json[ 'results' ];

        //
        foreach( $features as $feature )
        {
            $properties = $feature[ 'components' ];

            if( $properties[ '_type' ] == 'building' )
            {
                if( !array_key_exists( "road", $properties ) )
                    continue;

                if( !array_key_exists( "house_number", $properties ) )
                    continue;

                if( !array_key_exists( "state", $properties ) )
                    continue;

                if( !array_key_exists( "postcode", $properties ) )
                    continue;

                //
                $returnAddress = [
                    "street"      => $properties[ 'road' ],
                    "number"      => $properties[ 'house_number' ],
                    "city"        => $properties[ 'state' ],
                    "zip"         => $properties[ 'postcode' ],
                    "coordinates" => [
                        $feature[ 'geometry' ]['lng'],
                        $feature[ 'geometry' ]['lat']
                    ]
                ];

                $returnArray[] = $returnAddress;
            }
        }

        return $returnArray;
    }

    /**
     * Queries the mapzen API for addresses within an radius of 35 kilometers around vienna.
     * Returns null if an error occurred
     *
     * @param $input
     *
     * @return mixed|null
     */
    private function query( $input )
    {
        if( empty( $input ) )
            return null;

        $input = $input . ', Vienna, Austria';

        //
        $response = null;

        try
        {
            $client = new Client();
            $response = $client->request(
                'GET', 'https://api.opencagedata.com/geocode/v1/json',
                [
                    'query' => [
                        'q'              => $input,
                        'key'            => Config::get('services.opencagedata.key'),
                        'countrycode'    => 'at',
                        'no_annotations' => '1',
                    ],
                ]
            );
        }
        catch( \Exception $error )
        {
            return null;
        }

        //
        $result = null;

        try
        {
            $result = json_decode( $response->getBody(), true );
        }
        catch( \Exception $error )
        {
            //;
        }

        return $result;
    }
}

?>
