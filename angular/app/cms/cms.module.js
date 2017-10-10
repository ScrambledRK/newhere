import {CmsRoutesConfig} from "./cms.routes";
import {CmsPageComponent} from "./pages/cms-page";
import {CmsMenuComponent} from "./components/menu/cms-menu.component";
import {DialDirective} from "./directives/dial.directive";
import {FilterDirective} from "./directives/filter.directive";
import {PaginationDirective} from "./directives/pagination.directive";
import {UnpublishedDirective} from "./directives/unpublished.directive";
import {OfferTableDirective} from "./pages/offers/offer-table.directive";
import {OfferListComponent} from "./pages/offers/offer-list.component";
import {UserService} from "./services/user.service";

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
	.service("UserService",UserService)
;

// config
angular.module( 'app.cms' )
	.config( CmsRoutesConfig )
;

// directive
angular.module( 'app.cms' )
	.directive("dial",DialDirective)
	.directive("filter",FilterDirective)
	.directive("pagination",PaginationDirective)
	.directive("unpublished",UnpublishedDirective)
	.directive("offerTable",OfferTableDirective)
;

// ------------------------------- //
// ------------------------------- //

// component
angular.module( 'app.cms' )
	.component( 'cmsPage', CmsPageComponent )
	.component( 'cmsMenu', CmsMenuComponent )
	.component( 'cmsOfferList', OfferListComponent )
;