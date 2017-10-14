import {CmsRoutesConfig} from "./cms.routes";
import {CmsPageComponent} from "./pages/cms-page";
import {CmsMenuComponent} from "./components/menu/cms-menu.component";
import {DialDirective} from "./directives/dial.directive";
import {PaginationDirective} from "./directives/pagination.directive";
import {UnpublishedDirective} from "./directives/unpublished.directive";
import {OfferTableDirective} from "./pages/offers/list/offer-table.directive";
import {OfferListComponent} from "./pages/offers/list/offer-list.component";
import {UserService} from "./services/user.service";
import {SearchDirective} from "./directives/search.directive";
import {EnabledDirective} from "./directives/enabled.directive";
import {ProviderDirective} from "./directives/provider.directive";
import {CreateDirective} from "./directives/create.directive";
import {OfferDetailsDirective} from "./pages/offers/form/offer-details.directive";
import {OfferFiltersDirective} from "./pages/offers/form/offer-filters.directive";
import {OfferCategoriesDirective} from "./pages/offers/form/offer-categories.directive";
import {OfferImageDirective} from "./pages/offers/form/offer-image.directive";
import {OfferDateDirective} from "./pages/offers/form/offer-date.directive";
import {OfferAddressDirective} from "./pages/offers/form/offer-address.directive";
import {OfferTranslationDirective} from "./pages/offers/form/offer-translation.directive";
import {SaveDirective} from "./directives/save.directive";
import {CancelDirective} from "./directives/cancel.directive";
import {OfferFormComponent} from "./pages/offers/form/offer-form.component";
import {ImageUploaderComponent} from "./components/image-uploader/image-uploader.component";

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
	.directive( "cancel", CancelDirective )
	.directive( "create", CreateDirective )
	.directive( "save", SaveDirective )
	.directive( "offerDetails", OfferDetailsDirective )
	.directive( "offerFilters", OfferFiltersDirective )
	.directive( "offerCategories", OfferCategoriesDirective )
	.directive( "offerImage", OfferImageDirective )
	.directive( "offerDate", OfferDateDirective )
	.directive( "offerAddress", OfferAddressDirective )
	.directive( "offerTranslation", OfferTranslationDirective )
;

// ------------------------------- //
// ------------------------------- //

// component
angular.module( 'app.cms' )
	.component( 'cmsPage', CmsPageComponent )
	.component( 'cmsMenu', CmsMenuComponent )
	.component( 'cmsOfferList', OfferListComponent )
	.component( 'cmsOfferForm', OfferFormComponent )
	.component( 'imageUploader', ImageUploaderComponent )
;