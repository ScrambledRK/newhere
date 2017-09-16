import {RoutesConfig} from './main.routes';
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
import {MapService} from "./pages/content/services/map.service";
import {ContentService} from "./pages/content/services/content.service";
import {ProviderListPageComponent} from "./pages/content/pages/provider-list-page";
import {ProviderDetailPageComponent} from "./pages/content/pages/provider-detail-page";

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
;

//
angular.module( 'app.main' )
	.config( RoutesConfig )
;

// ------------------------------- //
// ------------------------------- //

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
;