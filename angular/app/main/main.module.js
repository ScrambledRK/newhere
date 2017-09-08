angular.module('app.main', [] );

// ------------------------------- //
// ------------------------------- //

import {MapService} from './content/map.service';
import {ContentService} from './content/content.service';

angular.module('app.main' )
	.service('MapService', MapService)
	.service('ContentService', ContentService)
;

// ------------------------------- //
// ------------------------------- //

import {HeaderComponent} from './header/header.component';
import {SideMenuComponent} from './side-menu/side-menu.component';
import {ContentComponent} from './content/content.component';
import {ToolbarComponent} from './content/toolbar.component';
import {MapComponent} from './content/map.component';

angular.module( 'app.main' )
	.component( 'mainHeader', HeaderComponent )
	.component( 'mainSideMenu', SideMenuComponent )
	.component( 'mainContent', ContentComponent )
	.component( 'mainToolbar', ToolbarComponent )
	.component( 'mainMap', MapComponent )
;

// ------------------------------- //
// ------------------------------- //

