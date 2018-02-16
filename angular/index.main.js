import './app/main/main.module';
import './app/cms/cms.module';

//
angular.module( 'app',
	[
		'app.main',
		'app.cms',

		'ui-leaflet',
		'ui.router',
		'ui.router.state.events',

		'ngMaterial',
		'angular-loading-bar',
		'restangular',
		'ngStorage',
		'satellizer',
		'angular.filter',
		'ngSanitize',
		'ngMessages',

		'pascalprecht.translate',
		'ngCookies',

		'app.partials'  // ngHtml2Js module of converted html templates
	] )
;

//
require( './app.js' );

// --------------------------------------------------- //
// RUN
// --------------------------------------------------- //

import {RoutesRun} from './run/routes.run';

angular.module( 'app' )
	.run( RoutesRun )
;

// --------------------------------------------------- //
// FILTER
// --------------------------------------------------- //

import {SubarrayFilter} from './filters/subarray.filter';
import {SprintfFilter} from './filters/sprintf.filter';
import {NgoPublishedFilter} from './filters/ngo_published.filter';
import {TranslationFilter} from './filters/translation.filter';
import {CapitalizeFilter} from './filters/capitalize.filter';
import {HumanReadableFilter} from './filters/human_readable.filter';
import {TruncatCharactersFilter} from './filters/truncate_characters.filter';
import {TruncateWordsFilter} from './filters/truncate_words.filter';
import {TrustHtmlFilter} from './filters/trust_html.filter';
import {UcFirstFilter} from './filters/ucfirst.filter';
import {OfferEnabledFilter} from './filters/offer_enabled.filter';

angular.module( 'app' )
	.filter( 'subarray', SubarrayFilter )
	.filter( 'sprintf', SprintfFilter )
	.filter( 'ngoPublished', NgoPublishedFilter )
	.filter( 'translation', TranslationFilter )
	.filter( 'capitalize', CapitalizeFilter )
	.filter( 'humanReadable', HumanReadableFilter )
	.filter( 'truncateCharacters', TruncatCharactersFilter )
	.filter( 'truncateWords', TruncateWordsFilter )
	.filter( 'trustHtml', TrustHtmlFilter )
	.filter( 'ucfirst', UcFirstFilter )
	.filter( 'offerEnabled', OfferEnabledFilter )
;

// --------------------------------------------------- //
// SERVICES
// --------------------------------------------------- //

import {APIService} from './services/API.service';
import {ToastService} from './services/toast.service';
import {SearchService} from './services/search.service';
import {LanguageService} from './services/language.service';
import {DialogService} from './services/dialog.service';

//
angular.module('app')
	.service('API', APIService)
	.service('SearchService', SearchService)
	.service('ToastService', ToastService)
	.service('LanguageService', LanguageService)
	.service('DialogService', DialogService)
;

// --------------------------------------------------- //
// DIRECTIVES
// --------------------------------------------------- //

import {CompareToDirective} from './directives/compareTo.directive';
import {TreeviewDirective} from './directives/treeview/treeview.directive';

angular.module( 'app' )
	.directive( 'compareTo', CompareToDirective )
	.directive( 'treeView', TreeviewDirective )
;

// --------------------------------------------------- //
// COMPONENTS
// --------------------------------------------------- //



// --------------------------------------------------- //
// CONFIG
// --------------------------------------------------- //

import {MaterialConfig} from './config/material.config';
import {TranslateConfig} from './config/translate.config';
import {LoadingBarConfig} from './config/loading_bar.config';
import {ThemeConfig} from './config/theme.config';
import {SatellizerConfig} from './config/satellizer.config';
import {MaterialPlaceHolderDirective} from './config/placeholder.config';

angular.module('app')
	.config(MaterialConfig)
	.config(TranslateConfig)
	.config(LoadingBarConfig)
	.config(ThemeConfig)
	.config(SatellizerConfig)
	.config(MaterialPlaceHolderDirective)
;

// --------------------------------------------------- //
// ETC
// --------------------------------------------------- //

angular.module('app').factory('missingTranslationHandler', function (isFrontendDebug,$log)
{
	return function (translationID, uses)
	{
		if( isFrontendDebug )
			$log.warn("missing translation:", translationID, "| language-key:", uses );

		return translationID;
	};
});

angular.module('app').config(function ($qProvider,isFrontendDebug)
{
	$qProvider.errorOnUnhandledRejections( isFrontendDebug );
});
