<?php

namespace App\Http\Controllers\Main;

use App\Category;
use App\Filter;
use App\Http\Controllers\Controller;
use App\Logic\Address\AddressAPI;
use App\Page;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;


class PageController extends Controller
{

    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function bySlug( $slug )
    {
        $page = Page::with( [] );

        //
        $page = $page->where('enabled', true );
        $page = $page->where('slug', $slug )->firstOrFail();

        // the where is useless for now, but in case we ever actually use the version as a filter
        $translations = $page->translations()->where("version",">=",0)->get(['id','locale']);

        //
        return response()->success( compact( 'page', 'translations' ) );
    }

}
