import {CmsRoutesConfig} from "./cms.routes";
import {CmsPageComponent} from "./pages/cms-page";
import {CmsMenuComponent} from "./components/menu/cms-menu.component";

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

;

// config
angular.module( 'app.cms' )
	.config( CmsRoutesConfig )
;

// directive
angular.module( 'app.cms' )

;

// ------------------------------- //
// ------------------------------- //

// component
angular.module( 'app.cms' )
	.component( 'cmsPage', CmsPageComponent )
	.component( 'cmsMenu', CmsMenuComponent )
;