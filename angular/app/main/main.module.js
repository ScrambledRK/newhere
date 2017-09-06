import {AppHeaderComponent} from './header/header.component';
import {AppMainMenuComponent} from './side-menu/side-menu.component';
import {AppCategoriesContentComponent} from './start/categories/categories-content.component';
import {AppCategoriesToolbarComponent} from './start/categories/categories-toolbar.component';

angular.module('app.components')
	.component('appSideMenu', AppMainMenuComponent)
	.component('appHeader', AppHeaderComponent)
	.component('appCategoriesContent', AppCategoriesContentComponent)
	.component('appCategoriesToolbar', AppCategoriesToolbarComponent)
;

