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
     * should not be used anymore, because frontend must provide coordinates ... hmm ...
     *
     * @param $street
     * @param $streetnumber
     * @param $zip
     *
     * @return null
     */
    public function getCoordinates( $street, $streetnumber, $zip )
    {
        $suggestion = $this->getSuggestion( $street . ' ' . $streetnumber . ', ' . $zip );

        if( $suggestion === null || count($suggestion) === 0 )
        {
            return null;
        }

        //
        try
        {
            return $this->getAddress( $suggestion[0]['id'] )[ 'coordinates' ];
        }
        catch( \Exception $error )
        {
            //;
        }

        return null;
    }

    /**
     * @param $input
     */
    public function getAddress( $id )
    {
        $json = $this->queryAddress( $id );

        if( $json == null )
        {
            return null;
        }

        //
        $result = [];

        foreach( $json[ 'result' ][ 'address_components' ] as $feature )
        {
            $types = $feature['types'];
            $value = $feature['long_name'];

            //
            if( in_array( "street_number", $types ) )
            {
                $result['number'] = $value;
            }
            elseif( in_array( "route", $types ) )
            {
                $result['street'] = $value;
            }
            elseif( in_array( "locality", $types ) )
            {
                $result['city'] = $value;
            }
            elseif( in_array( "postal_code", $types ) )
            {
                $result['zip'] = $value;
            }
        }

        //
        $result['coordinates'] = [
            $json[ 'result' ][ 'geometry' ]['location']['lng'],
            $json[ 'result' ][ 'geometry' ]['location']['lat']
        ];

        return $result;

    }

    /**
     * @param $input
     * @return mixed|null
     */
    private function queryAddress( $id )
    {
        if( empty( $id ) )
            return null;

        //
        $response = null;

        try
        {
            $client = new Client();
            $response = $client->request(
                'GET', 'https://maps.googleapis.com/maps/api/place/details/json',
                [
                    'query' => [
                        'placeid' => $id,
                        'key'     => Config::get( 'services.geocoding.key' ),
                        'region'  => 'at'
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

    /**
     * @param $input
     *
     * @return array
     * Returns an array of address suggestions, or an empty array if an error occurs or no suggestions were found
     */
    public function getSuggestion( $input )
    {
        $result = [];

        $json = $this->querySuggestion( $input );

        if( $json == null )
        {
            return $result;
        }

        //
        $features = $json[ 'predictions' ];

        foreach( $features as $feature )
        {
            $result[] = [
                "description" => $feature[ 'description' ],
                "id"          => $feature[ 'place_id' ]
            ];
        }

        return $result;
    }

    /**
     * @param $input
     * @return mixed|null
     */
    private function querySuggestion( $input )
    {
        if( empty( $input ) )
            return null;

        //
        $response = null;

        try
        {
            $client = new Client();
            $response = $client->request(
                'GET', 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
                [
                    'query' => [
                        'input'      => $input,
                        'key'        => Config::get( 'services.geocoding.key' ),
                        'components' => 'country:at',
                        'location'   => '48.208493,16.373118',
                        'radius'     => '35000',
                        'types'      => 'address',
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
