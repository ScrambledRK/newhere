<?php

namespace App\Logic\Address;

use GuzzleHttp\Client;

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
    public function getCoordinates($street, $streetnumber, $zip)
    {
        $json = $this->query($street.' '.$streetnumber.', '.$zip);

        if($json === null){
            return null;
        }

        try{
            $feature = $json['features'][0];

            return $feature['geometry']['coordinates'];
        }catch(\Exception $error){
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
    public function getAddressSuggestions($input)
    {
        $returnArray = [];

        $json = $this->query($input);

        if($json == null){
            return $returnArray;
        }

        $features = $json['features'];

        foreach($features as $feature){
            $properties = $feature['properties'];

            if(array_key_exists("street", $properties)
                && array_key_exists("housenumber", $properties)
                && array_key_exists("locality", $properties)
                && array_key_exists("postalcode", $properties)
            ){
                $returnAddress = [
                    "street" => $properties['street'],
                    "number" => $properties['housenumber'],
                    "city"   => $properties['locality'],
                    "zip"    => $properties['postalcode'],
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
    private function query($input)
    {
        if(empty($input)){
            return null;
        }

        //
        $response = null;

        try{
            $client = new Client();
            $response = $client->request(
                'GET', 'https://search.mapzen.com/v1/search',
                [
                    'query' => [
                        'text'                   => $input,
                        'api_key'                => 'search-pTjgegT',
                        'layers'                 => 'address',
                        'boundary.circle.lat'    => 48.208493,
                        'boundary.circle.lon'    => 16.373118,
                        'boundary.circle.radius' => 35,
                    ],
                ]
            );
        }catch(\Exception $error){
            return null;
        }

        //
        $result = null;

        try{
            $result = json_decode($response->getBody(), true);
        }catch(\Exception $error){
            //;
        }

        return $result;
    }
}

?>
