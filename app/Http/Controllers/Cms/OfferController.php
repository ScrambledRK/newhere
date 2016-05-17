<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;

use App\Ngo;
use App\Offer;
use App\Role;
use App\User;
use App\Filter;
use Illuminate\Http\Request;
use Auth;
use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use App\Logic\Address\AddressAPI;

use Log;

class OfferController extends Controller
{
  //  public function index() {
  //     $ngos = Ngo::with(['image','users', 'offers'])->get();
  //     return response()->json($ngos);
  //  }
   public function index() {
       $offers = Offer::with(['ngo', 'filters','categories', 'countries'])->get();
       return response()->json($offers);
   }

   public function autocomplete($search) {
      $addressApi = new AddressAPI();
      $returnArray = $addressApi->getAddressSuggestions($search);
      return response()->json($returnArray);
   }

  //  public function show($id) {
  //     $ngo = Ngo::findOrFail($id);
  //     return response()->json($ngo);
  //  }
  public function show($id) {
      $offer= Offer::where('id',$id)->with(['ngo', 'filters', 'categories', 'countries'])->firstOrFail();
      return response()->json($offer);
   }

   public function create(Request $request) {

      $this->validate($request, [
         'title' => 'required|max:255',
         'description' => 'required',
         'street' => 'required',
         'streetnumber' => 'required',
         'zip' => 'required',
         'city' => 'required'
      ]);

      $addressApi = new AddressAPI();
      $coordinates = $addressApi->getCoordinates($request->get('street'), $request->get('streetnumber'), $request->get('zip'));


      DB::beginTransaction();

      $ngoUser = Auth::user();


      $offer = new Offer();
      $offer->title = $request->get('title');
      $offer->description = $request->get('description');
      $offer->opening_hours = $request->get('opening_hours');
      $offer->website = $request->get('website');
      $offer->email = $request->get('email');
      $offer->phone = $request->get('phone');
      $offer->street = $request->get('street');
      $offer->streetnumber = $request->get('streetnumber');
      $offer->streetnumberadditional = $request->get('streetnumberadditional');
      $offer->zip = $request->get('zip');
      $offer->city = $request->get('city');
      $offer->valid_from = $request->get('valid_from');
      $offer->valid_until = $request->get('valid_until');

      $offer->latitude = $coordinates[0];
      $offer->longitude = $coordinates[1];

      $ngo = $ngoUser->ngos()->firstOrFail();

      $offer->ngo_id = $ngo->id;

      //Standard Translation
      //if ($request->has('description')) {
      //   $locale = $request->get('language');
      //   $ngo->translateOrNew($locale)->description = $request->get('description');
      //}
      $offer->save();

      if($request->has('filters')){
        foreach($request->get('filters') as $key => $filter){
          $f = Filter::findOrFail($filter['id']);
          $offer->filters()->attach($f);
        }
      }
      if($request->has('categories')){
        foreach($request->get('categories') as $key => $category){
          $cat = Category::findOrFail($category['id']);
          $offer->categories()->attach($cat);
        }
      }

      DB::commit();
      return response()->success(compact('offer'));
   }
   public function update(Request $request, $id){
     $offer = Offer::findOrFail($id);
     $success = $offer->update($request->all());

     if($request->has('filters')){
       $offer->filters()->detach();
       foreach($request->get('filters') as $key => $filter){
         $f = Filter::findOrFail($filter['id']);
         $offer->filters()->attach($f);
       }
     }
     return response()->success(compact('success'));
   }
   public function toggleEnabled(Request $request, $id) {
       $this->validate($request, [
           'enabled' => 'required'
       ]);

       $offer = Offer::find((int)$id);
       if (!$offer) {

           return response()->error('Offer not found', 404);
       }

       $modified = false;
       if (isset($request->enabled)) {
           $offer->enabled = (bool)$request->enabled;
           $modified = true;
       }

       if ($modified) {
           $offer->save();
       }

       return response()->success(compact('offer'));
   }
   public function bulkAssign(Request $request, $ids){
     $offersQ = Offer::whereIn('id', explode(',', $ids));
     $offers = $offersQ->get();
     $updatedRows = $offersQ->update([$request->get('field') => $request->get('value')]);

     return response()->success(compact('offers', 'updatedRows'));
   }
   function bulkRemove($ids){
     $offersQ = Offer::whereIn('id', explode(',', $ids));
     $offers = $offersQ->get();
     $deletedRows = $offersQ->delete();

     return response()->success(compact('offers', 'deletedRows'));
   }
}
