import {CmsRoutesConfig} from "./cms.routes";
import {CmsPageComponent} from "./pages/cms-page";
import {CmsMenuComponent} from "./components/menu/cms-menu.component";
import {DialDirective} from "./directives/dial.directive";
import {PaginationDirective} from "./directives/pagination.directive";
import {UnpublishedDirective} from "./directives/unpublished.directive";
import {OfferTableDirective} from "./pages/offers/offer-table.directive";
import {OfferListComponent} from "./pages/offers/offer-list.component";
import {UserService} from "./services/user.service";
import {SearchDirective} from "./directives/search.directive";
import {EnabledDirective} from "./directives/enabled.directive";
import {ProviderDirective} from "./directives/provider.directive";
import {CreateDirective} from "./directives/create.directive";

// ------------------------------- //
// ------------------------------- //

//
angular.module( 'app.cms',
	[
		'ui.router',
		'ui.router.state.events'
	] );

// service
angular.module( 'app.cms' )
	.service( "UserService", UserService )
;

// config
angular.module( 'app.cms' )
	.config( CmsRoutesConfig )
;

// directive
angular.module( 'app.cms' )
	.directive( "dial", DialDirective )
	.directive( "search", SearchDirective )
	.directive( "enabled", EnabledDirective )
	.directive( "provider", ProviderDirective )
	.directive( "pagination", PaginationDirective )
	.directive( "unpublished", UnpublishedDirective )
	.directive( "offerTable", OfferTableDirective )
	.directive( "create", CreateDirective )
;

// ------------------------------- //
// ------------------------------- //

// component
angular.module( 'app.cms' )
	.component( 'cmsPage', CmsPageComponent )
	.component( 'cmsMenu', CmsMenuComponent )
	.component( 'cmsOfferList', OfferListComponent )
;