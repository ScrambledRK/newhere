import {AppHeaderComponent}     from './app-header/app-header.component';
import {AppMainMenuComponent}   from './app-side-menu/app-side-menu.component';

angular.module('app.components')
	.component('appMainMenu', AppMainMenuComponent)
	.component('appHeader', AppHeaderComponent)
;

