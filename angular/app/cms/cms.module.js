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
import {OfferService} from "./services/offer.service";
import {MapService} from "../main/services/map.service";
import {FilterService} from "../../services/filter.service";
import {FilterSelectorComponent} from "./components/filter-selector/filter-selector.component";
import {CategoryService} from "./services/category.service";
import {CategorySelectorComponent} from "./components/category-selector/category-selector.component";
import {ProviderListComponent} from "./pages/providers/list/provider-list.component";
import {ProviderService} from "./services/provider.service";
import {ProviderTableDirective} from "./pages/providers/list/provider-table.directive";
import {UserListComponent} from "./pages/users/list/user-list.component";
import {UserTableDirective} from "./pages/users/list/user-table.directive";
import {TranslationTableDirective} from "./pages/translations/list/translation-table.directive";
import {TranslationService} from "./services/translation.service";
import {TranslationListComponent} from "./pages/translations/list/translation-list.component";
import {TranslationTypeDirective} from "./pages/translations/list/translation-type.directive";
import {TranslationStatusDirective} from "./pages/translations/list/translation-status.directive";
import {TranslationLanguageDirective} from "./pages/translations/list/translation-lang.directive";
import {DashboardComponent} from "./pages/dashboard/default/dashboard.component";
import {ProviderFormComponent} from "./pages/providers/form/provider-form.component";
import {RequestTableComponent} from "./components/request/request-table.component";
import {UserFormComponent} from "./pages/users/form/user-form.component";
import {UserMenuComponent} from "./components/menu/cms-user-menu.component";
import {DashboardPageComponent} from "./pages/dashboard/dashboard-page.component";
import {ProfileComponent} from "./pages/dashboard/profile/profile.component";
import {PageService} from "./services/page.service";
import {PageTableDirective} from "./pages/pages/list/page-table.directive";
import {PageListComponent} from "./pages/pages/list/page-list.component";
import {PageFormComponent} from "./pages/pages/form/page-form.component";
import {LanguageMenuComponent} from "../main/components/language-switcher/language-menu.component";
import {CategoryFormComponent} from "./pages/category/category-form.component";
import {TinyMceComponent} from "./components/tinymce/cms-tinymce.component";
import {ProviderTasksComponent} from "./pages/dashboard/provider/provider-tasks.component";
import {ProviderTasksTableDirective} from "./pages/dashboard/provider/provider-tasks-table.directive";
import {FlowConfig} from "../../config/flow.config";
//import {ResetpasswordFormComponent} from "../main/pages/login/resetpassword-form.component";

// ------------------------------- //
// ------------------------------- //

//
angular.module( 'app.cms',
	[
		'ui.router',
		'ui.router.state.events',
		'ui.tinymce',

		'md.data.table',
		'ui.tree',
		'dndLists',
		'flow',
		'mgo-angular-wizard',
		'bw.paging',
	] );

// service
angular.module( 'app.cms' )
	.service( "UserService", UserService )
	.service( "OfferService", OfferService )
	.service( "MapService", MapService )
	.service( "FilterService", FilterService )
	.service( "CategoryService", CategoryService )
	.service( "ProviderService", ProviderService )
	.service( "TranslationService", TranslationService )
	.service( "PageService", PageService )
;

// config
angular.module( 'app.cms' )
	.config( CmsRoutesConfig )
	.config(FlowConfig)
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
	.directive( "providerTable", ProviderTableDirective )
	.directive( "translationTable", TranslationTableDirective )
	.directive( "userTable", UserTableDirective )
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
	.directive( "translationType", TranslationTypeDirective )
	.directive( "translationStatus", TranslationStatusDirective )
	.directive( "translationLanguage", TranslationLanguageDirective )
	.directive( "pageTable", PageTableDirective )
	.directive( "providerTasksTable", ProviderTasksTableDirective )
;

// ------------------------------- //
// ------------------------------- //

// component
angular.module( 'app.cms' )
	.component( 'cmsPage', CmsPageComponent )
	.component( 'cmsMenu', CmsMenuComponent )
	.component( 'cmsDashboardPage', DashboardPageComponent )
	.component( 'cmsOfferList', OfferListComponent )
	.component( 'cmsOfferForm', OfferFormComponent )
	.component( 'cmsProviderList', ProviderListComponent )
	.component( 'cmsProviderForm', ProviderFormComponent )
	.component( 'cmsUserList', UserListComponent )
	.component( 'cmsUserForm', UserFormComponent )
	.component( 'cmsTranslationList', TranslationListComponent )
	.component( 'imageUploader', ImageUploaderComponent )
	.component( 'filterSelector', FilterSelectorComponent )
	.component( 'categorySelector', CategorySelectorComponent )
	.component( 'cmsDashboard', DashboardComponent )
	.component( 'cmsProfile', ProfileComponent )
	.component( 'cmsRequestTable', RequestTableComponent )
	.component( 'cmsUserMenu', UserMenuComponent )
	.component( 'cmsPageList', PageListComponent )
	.component( 'cmsPageForm', PageFormComponent )
	.component( 'cmsLanguageMenu', LanguageMenuComponent )
	.component( 'cmsCategoryForm', CategoryFormComponent )
	.component( 'cmsTinyMce', TinyMceComponent )
	.component( 'cmsProviderTasks', ProviderTasksComponent )
	//.component( 'resetpasswordForm', ResetpasswordFormComponent )
;