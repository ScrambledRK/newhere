import './app/main/main.module';

// ----------------- //

import {LoaderComponent} from './app/loader/loader.component';
import {AppLanguageSwitcherComponent} from './app/language-switcher/language-switcher.component';
import {MapComponent} from './app/map/map.component';

angular.module('app.components')
	.component('loader', LoaderComponent)
	.component('languageSwitcher', AppLanguageSwitcherComponent)
	.component('map', MapComponent)
;

// ----------------- //

angular.module('app.components')
;