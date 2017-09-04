<?php

namespace App\Http\Controllers\Cms;

use App\Category;
use App\Filter;
use App\Http\Controllers\Controller;
use App\Logic\Address\AddressAPI;
use App\Ngo;
use App\Offer;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class OfferController extends Controller
{

    /**
     * @param Request $request
     * @return mixed
     */
    public function index( Request $request )
    {
        $offers = Offer::with(
            [
                'ngo',
                'filters',
                'categories',
                'countries',
                'image'
            ]
        );

        //
        $count = $offers->count();

        //
        if( $request->has( 'ngo_id' ) )
        {
            $offers = $offers->where( 'ngo_id', $request->get( 'ngo_id' ) );
            $count = $offers->count();
        }

        //
        if( $request->has( 'enabled' ) )
        {
            $offers = $offers->where( 'enabled', $request->get( 'enabled' ) );
            $count = $offers->count();
        }

        //
        if( $request->has( 'title' ) )
        {
            $offers = $offers->whereTranslationLike( 'title', '%' . $request->get( 'title' ) . '%' );
            $count = $offers->count();
        }

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

            $offers = $offers->orderBy( $order, $dir );
        }

        //
        if( $request->has( 'limit' ) )
        {
            $offers = $offers->take( $request->get( 'limit' ) );
        }

        //
        if( $request->has( 'page' ) )
        {
            $offers = $offers->skip( ( $request->get( 'page' ) - 1 ) * $request->get( 'limit' ) );
        }

        //
        $offers = $offers->get();

        return response()->success( compact( 'offers', 'count' ) );
    }

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show( $id )
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
     * @param $id
     * @return mixed
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
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function setIsEnabled( Request $request, $id )
    {
        $this->validate( $request, [
            'enabled' => 'required'
        ] );

        // ---------------------------------- //
        // ---------------------------------- //

        $offer = Offer::findOrFail($id);
        $modified = false;

        if( isset( $request->enabled ) )
        {
            $offer->enabled = (bool)$request->enabled;
            $modified = true;
        }

        if( $modified )
        {
            $offer->save();
        }

        return response()->success( compact( 'offer' ) );
    }

    /**
     * @param Request $request
     * @param $ids
     * @return mixed
     */
    public function bulkAssign( Request $request, $ids )
    {
        $offersQ = Offer::whereIn( 'id', explode( ',', $ids ) );
        $offers = $offersQ->get();

        $updatedRows = $offersQ->update(
            [ $request->get( 'field' ) => $request->get( 'value' ) ]
        );

        return response()->success( compact( 'offers', 'updatedRows' ) );
    }

    /**
     * @param $ids
     * @return mixed
     */
    public function bulkRemove( $ids )
    {
        $offersQ = Offer::whereIn( 'id', explode( ',', $ids ) );
        $offers = $offersQ->get();

        $deletedRows = $offersQ->delete();

        return response()->success( compact( 'offers', 'deletedRows' ) );
    }
}
