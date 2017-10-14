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
            $ngos = $user->getRelations()["ngos"];

            foreach ($ngos as $ngo)
            {
                $result = $result->orWhere( 'ngo_id', $ngo->getAttribute("id") );
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
            $result = $result->whereTranslationLike( 'title', '%' . $request->get( 'title' ) . '%' );
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

        return response()->success( compact( 'offer' ) );
    }

    /**
     * @param Request $request
     */
    public function update( Request $request, $id )
    {
        DB::beginTransaction();

        $offer = Offer::findOrFail($id);
        $offer = $this->populateFromRequest( $request, $offer );
        $offer->save();

        DB::commit();

        return response()->success( compact( [ 'offer' ] ) );
    }

    /**
     * @param Request $request
     * @param Offer $offer
     * @return Offer
     */
    private function populateFromRequest( Request $request, Offer $offer )
    {
        if( !$this->isUserOffer( $offer ) )
            throw new AccessDeniedHttpException();

        //
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
            $ngo = Ngo::find( (int)$request->get( 'ngo_id' ));
        }
        else
        {
            $ngoUser = Auth::user();
            $ngo = $ngoUser->ngos()->firstOrFail();
        }

        //
        $offer->title           = $request->get( 'title' );
        $offer->description     = $request->get( 'description' );
        $offer->opening_hours   = $request->get( 'opening_hours' );
        $offer->website         = $request->get( 'website' );
        $offer->facebook_url    = $request->get( 'facebook_url' );
        $offer->email           = $request->get( 'email' );
        $offer->phone           = $request->get( 'phone' );
        $offer->valid_from      = $request->get( 'valid_from' );
        $offer->valid_until     = $request->get( 'valid_until' );
        $offer->image_id        = $request->get( 'image_id' );
        $offer->ngo_id          = $ngo->id;
        $offer->enabled         = $ngo->published;

        if( $request->has( 'enabled' ) )
            $offer->enabled = $request->get( 'enabled' );

        //
        $hasAddress = $request->has( 'street' )
            && $request->has( 'streetnumber' )
            && $request->has( 'zip' );

        if( $hasAddress )
        {
            $addressApi = new AddressAPI();
            $coordinates = $addressApi->getCoordinates(
                $request->get( 'street' ),
                $request->get( 'streetnumber' ),
                $request->get( 'zip' ) );

            $offer->street                  = $request->get( 'street' );
            $offer->streetnumber            = $request->get( 'streetnumber' );
            $offer->streetnumberadditional  = $request->get( 'streetnumberadditional' );
            $offer->zip                     = $request->get( 'zip' );
            $offer->city                    = $request->get( 'city' );
            $offer->latitude                = $coordinates[ 0 ];
            $offer->longitude               = $coordinates[ 1 ];
        }

        // ---------------------------------- //
        // ---------------------------------- //

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

        // ---------------------------------- //
        // ---------------------------------- //

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
        $ngos = $user->getRelations()["ngos"];

        foreach($ngos as $ngo)
        {
            if( $ngo->getAttribute("id") === $offer->getAttribute("ngo_id") )
                return true;
        }

        return false;
    }
}
