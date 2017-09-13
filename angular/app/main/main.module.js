angular.module( 'app.main',
	[
		'ui.router',
		'ui.router.state.events'
	] );

// ------------------------------- //
// ------------------------------- //

import {MapService} from './content/map/map.service';
import {ContentService} from './content/content.service';

angular.module( 'app.main' )
	.service( 'MapService', MapService )
	.service( 'ContentService', ContentService )
;

// ------------------------------- //
// ------------------------------- //

import {HeaderComponent} from './header/header.component';
import {LocatorComponent} from './header/locator.component';
import {SideMenuComponent} from './side-menu/side-menu.component';
import {LoaderComponent} from './loader/loader.component';
import {LanguageSwitcherComponent} from './language-switcher/language-switcher.component';

angular.module( 'app.main' )
	.component( 'mainHeader', HeaderComponent )
	.component( 'locator', LocatorComponent )
	.component( 'mainSideMenu', SideMenuComponent )
	.component( 'loader', LoaderComponent )
	.component( 'languageSwitcher', LanguageSwitcherComponent )
;

// ------------------------------- //
// ------------------------------- //

import {CategoryListComponent} from './content/offers/category-list.component';
import {OfferListComponent} from './content/offers/offer-list.component';
import {OfferDetailComponent} from './content/offers/offer-detail.component';
import {ProviderListComponent} from './content/providers/provider-list.component';
import {ProviderDetailComponent} from './content/providers/provider-detail.component';
import {ToolbarComponent} from './content/toolbar/toolbar.component';
import {MapComponent} from './content/map/map.component';

angular.module( 'app.main' )
	.component( 'mainCategoryList', CategoryListComponent )
	.component( 'mainOfferList', OfferListComponent )
	.component( 'mainOfferDetail', OfferDetailComponent )
	.component( 'mainProviderList', ProviderListComponent )
	.component( 'mainProviderDetail', ProviderDetailComponent )
	.component( 'mainToolbar', ToolbarComponent )
	.component( 'mainMap', MapComponent )
;

// ------------------------------- //
// ------------------------------- //

import {RoutesConfig} from './main.routes';

angular.module( 'app.main' )
	.config( RoutesConfig )
;

