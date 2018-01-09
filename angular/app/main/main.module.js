import {MainRoutesConfig} from './main.routes';
import {ContentPageComponent} from "./pages/content/content-page";
import {CategoryListComponent} from "./pages/content/components/category-list/category-list.component";
import {OfferListComponent} from "./pages/content/components/offer-list/offer-list.component";
import {OfferDetailComponent} from "./pages/content/components/offer-detail/offer-detail.component";
import {ProviderListComponent} from "./pages/content/components/provider-list/provider-list.component";
import {ProviderDetailComponent} from "./pages/content/components/provider-detail/provider-detail.component";
import {ToolbarComponent} from "./pages/content/components/toolbar/toolbar.component";
import {MapComponent} from "./pages/content/components/map/map.component";
import {ContentDetailPageComponent} from "./pages/content/pages/content-detail-page";
import {ContentListPageComponent} from "./pages/content/pages/content-list-page";
import {MapTogglerCircle, MapTogglerWide} from "./pages/content/components/map-toggler/map-toggler.component";
import {ProviderListPageComponent} from "./pages/content/pages/provider-list-page";
import {ProviderDetailPageComponent} from "./pages/content/pages/provider-detail-page";
import {LoginFormComponent} from "./pages/login/login-form.component";
import {HeaderComponent} from "./components/header/header.component";
import {LocatorComponent} from "./components/header/locator.component";
import {SideMenuComponent} from "./components/side-menu/side-menu.component";
import {LanguageSwitcherComponent} from "./components/language-switcher/language-switcher.component";
import {LoaderComponent} from "./components/loader/loader.component";
import {MapService} from "./services/map.service";
import {ContentService} from "./services/content.service";
import {OfferTitleDirective} from "./directives/offer-title.directive";
import {RoutingService} from "./services/routing.service";
import {RegisterFormComponent} from "./pages/login/register-form.component";
import {ForgotpasswordFormComponent} from "./pages/login/forgotpassword-form.component";
import {ResetpasswordFormComponent} from "./pages/login/resetpassword-form.component";

// ------------------------------- //
// ------------------------------- //

//
angular.module( 'app.main',
	[
		'ui.router',
		'ui.router.state.events'
	] );

//
angular.module( 'app.main' )
	.service( 'MapService', MapService )
	.service( 'ContentService', ContentService )
	.service( 'RoutingService', RoutingService )
;

//
angular.module( 'app.main' )
	.config( MainRoutesConfig )
;

//
angular.module( 'app.main' )
	.directive( "offerTitle", OfferTitleDirective )
;

// ------------------------------- //
// ------------------------------- //

angular.module( 'app.main' )
	.component( 'appHeader', HeaderComponent )
	.component( 'locator', LocatorComponent )
	.component( 'sideMenu', SideMenuComponent )
	.component( 'loader', LoaderComponent )
	.component( 'languageSwitcher', LanguageSwitcherComponent )
;

angular.module( 'app.main' )
	.component( 'categoryList', CategoryListComponent )
	.component( 'offerList', OfferListComponent )
	.component( 'offerDetail', OfferDetailComponent )
	.component( 'providerList', ProviderListComponent )
	.component( 'providerDetail', ProviderDetailComponent )
	.component( 'toolbar', ToolbarComponent )
	.component( 'map', MapComponent )
	.component( 'contentPage', ContentPageComponent )
	.component( 'contentDetailPage', ContentDetailPageComponent )
	.component( 'contentListPage', ContentListPageComponent )
	.component( 'providerListPage', ProviderListPageComponent )
	.component( 'providerDetailPage', ProviderDetailPageComponent )
	.component( 'mapTogglerWide', MapTogglerWide )
	.component( 'mapTogglerCircle', MapTogglerCircle )
	.component( 'loginForm', LoginFormComponent )
	.component( 'registerForm', RegisterFormComponent )
	.component( 'forgotpasswordForm', ForgotpasswordFormComponent )
	.component( 'resetpasswordForm', ResetpasswordFormComponent )
;