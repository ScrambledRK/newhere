import {AppHeaderComponent}     from './app-header/app-header.component';
import {AppMainMenuComponent}   from './app-side-menu/app-side-menu.component';

angular.module('app.components')
	.component('appSideMenu', AppMainMenuComponent)
	.component('appHeader', AppHeaderComponent)
;

