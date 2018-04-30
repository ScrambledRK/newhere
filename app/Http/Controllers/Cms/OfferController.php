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
use phpDocumentor\Reflection\Types\Boolean;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;


class OfferController extends Controller
{

    /**
     * @param Request $request
     * @return mixed
     */
    public function index( Request $request )
    {
        $result = Offer::with(
            [
                'ngo'
            ]
        );

        //
        $count = $result->count();

        // ------------------- //

        $user = Auth::user();

        if( !$this->isUserAdmin( $user ) )
        {
            $user->load( 'ngos' );
            $ngos = $user->getRelations()[ "ngos" ];

            foreach( $ngos as $ngo )
            {
                $result = $result->orWhere( 'ngo_id', $ngo->getAttribute( "id" ) );
                $count = $result->count();
            }
        }

        // ------------------- //

        //
        if( $request->has( 'ngo_id' ) )
        {
            $result = $result->where( 'ngo_id', $request->get( 'ngo_id' ) );
            $count = $result->count();
        }

        //
        if( $request->has( 'enabled' ) )
        {
            $result = $result->where( 'enabled', $request->get( 'enabled' ) );
            $count = $result->count();
        }

        //
        if( $request->has( 'title' ) )
        {
            $toSearch = $request->get( 'title' );

            //
            $result = $result->where( function( $query ) use ( $toSearch )
            {
                $query->whereHas( 'translations',
                    function( $query ) use ( $toSearch )
                    {
                        $query->where(
                            'title',
                            'ilike',
                            '%' . $toSearch . '%'
                        );
                    } )
                      ->orWhere(
                          'street',
                          'ilike',
                          '%' . $toSearch . '%'
                      );
            } );

            $count = $result->count();
        }

        // ------------------------------------------- //
        // ------------------------------------------- //

        //
        $result = $this->paginate( $request, $result );

        //
        $result = $result->get();

        // ------------------------------------------- //
        // ------------------------------------------- //

        return response()->success( compact( 'result', 'count' ) );
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function byId( $id )
    {
        $offer = Offer::where( 'id', $id )->with(
            [
                'ngo',
                'filters',
                'categories',
                'countries',
                'image',
                'translations'
            ]
        )->firstOrFail();

        if( !$this->isUserOffer( $offer ) )
            throw new AccessDeniedHttpException();

        return response()->json( $offer );
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function create( Request $request )
    {
        DB::beginTransaction();

        $offer = new Offer();
        $offer = $this->populateFromRequest( $request, $offer );
        $offer->save();

        $offer = $this->attachFromRequest( $request, $offer );  // must save inbetween for id
        $offer->save();

        //
        if( $request->has( 'translations' ) )
        {
            foreach( $request->get( 'translations' ) as $key => $translation )
            {
                $offer->translateOrNew( $key )->title = $translation[ 'title' ];
                $offer->translateOrNew( $key )->description = $translation[ 'description' ];
                $offer->translateOrNew( $key )->opening_hours = $translation[ 'opening_hours' ];
                $offer->save();
            }
        }

        DB::commit();

        //
        $this->updateCategories();

        //
        return response()->success( compact( 'offer' ) );
    }

    /**
     * @param Request $request
     */
    public function update( Request $request, $id )
    {
        DB::beginTransaction();

        $offer = Offer::findOrFail( $id );
        $offer = $this->populateFromRequest( $request, $offer );
        $offer = $this->attachFromRequest( $request, $offer );
        $offer->save();

        DB::commit();

        //
        $this->updateCategories();

        //
        return response()->success( compact( [ 'offer' ] ) );
    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function delete( Request $request, $id )
    {
        $offer = Offer::findOrFail( $id );

        if( !$this->isUserOffer( $offer ) )
            throw new AccessDeniedHttpException();

        //
        $this->updateCategories();

        $offer->delete();

        //
        return response()->success( compact( 'offer' ) );
    }

    /**
     * @param Request $request
     * @param Offer $offer
     * @return Offer
     */
    private function populateFromRequest( Request $request, Offer $offer )
    {
        $this->validate( $request, [
            'title'       => 'required|max:255',
            'description' => 'required',
        ] );

        // ---------------------------------- //
        // ---------------------------------- //

        $ngo = null;

        //
        if( $request->has( 'ngo_id' ) )
        {
            $ngo = Ngo::find( (int)$request->get( 'ngo_id' ) );
        }
        else
        {
            $ngoUser = Auth::user();
            $ngo = $ngoUser->ngos()->firstOrFail();
        }

        // ---------------------------------- //
        // ---------------------------------- //

        //
        $hasTitleChanged = $offer->title != $request->get( 'title' );
        $hasDescriptionChanged = $offer->description != $request->get( 'description' );
        $hasHoursChanged = $offer->opening_hours != $request->get( 'opening_hours' );

        if( $hasTitleChanged || $hasDescriptionChanged || $hasHoursChanged )
        {
            $locale = $request->header( "Language", "de" );

            $offer->translations()->where( "locale", "!=", $locale )
                  ->update( [ 'version' => 0 ] );

            $offer->translations()->where( "locale", "=", $locale )
                  ->update( [ 'version' => 2 ] );
        }

        // ---------------------------------- //
        // ---------------------------------- //

        //
        $offer->title = $request->get( 'title' );
        $offer->description = $request->get( 'description' );
        $offer->opening_hours = $request->get( 'opening_hours' );
        $offer->website = $request->get( 'website' );
        $offer->facebook_url = $request->get( 'facebook_url' );
        $offer->email = $request->get( 'email' );
        $offer->phone = $request->get( 'phone' );
        $offer->valid_from = $request->get( 'valid_from' );
        $offer->valid_until = $request->get( 'valid_until' );
        $offer->image_id = $request->get( 'image_id' );
        $offer->enabled = $request->get( 'enabled' );
        $offer->ngo_id = $ngo->id;

        //
        if( !$this->isUserOffer( $offer ) )
            throw new AccessDeniedHttpException();

        // ---------------------------------- //
        // ---------------------------------- //

        //
        $hasAddress = $request->has( 'street' )
            && $request->has( 'streetnumber' )
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
                    $request->get( 'streetnumber' ),
                    $request->get( 'zip' ) );
            }

            $offer->street = $request->get( 'street' );
            $offer->streetnumber = $request->get( 'streetnumber' );
            $offer->streetnumberadditional = $request->get( 'streetnumberadditional' );
            $offer->zip = $request->get( 'zip' );
            $offer->city = $request->get( 'city' );
            $offer->latitude = $coordinates[ 0 ];
            $offer->longitude = $coordinates[ 1 ];
        }
        else
        {
            $offer->street = null;
            $offer->streetnumber = null;
            $offer->streetnumberadditional = null;
            $offer->zip = null;
            $offer->city = null;
            $offer->latitude = null;
            $offer->longitude = null;
        }

        // ---------------------------------- //
        // ---------------------------------- //

        return $offer;
    }

    /**
     * @param Request $request
     * @param Offer $offer
     * @return Offer
     */
    private function attachFromRequest( Request $request, Offer $offer )
    {
        //
        if( $request->has( 'filters' ) )
        {
            $offer->filters()->detach();

            foreach( $request->get( 'filters' ) as $key => $filter )
            {
                $f = Filter::findOrFail( $filter[ 'id' ] );
                $offer->filters()->attach( $f );
            }
        }

        //
        if( $request->has( 'categories' ) )
        {
            $offer->categories()->detach();

            foreach( $request->get( 'categories' ) as $key => $category )
            {
                $cat = Category::findOrFail( $category[ 'id' ] );
                $offer->categories()->attach( $cat );
            }
        }

        return $offer;
    }

    /**
     * @param $offer
     * @return bool
     */
    private function isUserOffer( $offer )
    {
        $user = Auth::user();

        if( $this->isUserAdmin( $user ) )
            return true;

        //
        $user->load( 'ngos' );
        $ngos = $user->getRelations()[ "ngos" ];

        foreach( $ngos as $ngo )
        {
            if( $ngo->getAttribute( "id" ) === $offer->getAttribute( "ngo_id" ) )
                return true;
        }

        return false;
    }

    /**
     * @param Offer $offer
     */
    private function updateCategories( Category $category = null )
    {
        if( $category == null )
        {
            $category = Category::with( [ 'allChildren' ] )
                                ->where( "slug", "start" )
                                ->get()[ 0 ];
        }

        //$category = $category->fresh( [ 'allChildren' ] );

        // ---------------------------- //
        // ---------------------------- //

        $from = "unset";
        $until = "unset";
        $num = 0;

        //
        $categories = $category->getRelations()[ "allChildren" ];

        foreach( $categories as $cat )
        {
            $result = $this->updateCategories( $cat );

            $isFromDate = $from != null && $from != "unset";
            $isUntilDate = $until != null && $until != "unset";

            //
            if( $result[ 0 ] > 0 )
            {
                $num += $result[ 0 ];

                //
                if( $result[ 1 ] == null
                    || ( $isFromDate && $result[ 1 ] < $from )
                    || $from === "unset" )  // null overrules a date
                {
                    $from = $result[ 1 ];
                }

                if( $result[ 2 ] == null
                    || ( $isUntilDate && $result[ 2 ] > $until )
                    || $until === "unset" )
                {
                    $until = $result[ 2 ];
                }
            }
        }

        // ---------------------------- //
        // ---------------------------- //

        $category->load( "offers" );
        $offers = $category->getRelations()[ "offers" ];

        //$num += count( $offers );

        //
        foreach( $offers as $off )
        {
            $num++;

            //
            $isFromDate = $from != null && $from != "unset";
            $isUntilDate = $until != null && $until != "unset";

            if( $off->valid_from == null
                || ( $isFromDate && $off->valid_from < $from )
                || $from === "unset" )
            {
                $from = $off->valid_from;
            }

            if( $off->valid_until == null
                || ( $isUntilDate && $off->valid_until > $until )
                || $until === "unset" )
            {
                $until = $off->valid_until;
            }
        }

        //
        if( $from === "unset" )
        {
            $from = null;
        }

        if( $until === "unset" )
        {
            $until = null;
        }

        // ---------------------------- //
        // ---------------------------- //

        $category->num_offers = $num;
        $category->valid_from = $from;
        $category->valid_until = $until;
        $category->save();

        return [ $num, $from, $until ];
    }
}
