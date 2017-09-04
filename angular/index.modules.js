/* eslint-disable no-mixed-spaces-and-tabs */

angular.module( 'app', [
	'app.run',
	'app.filters',
	'app.services',
	'app.directives',
	'app.components',
	'app.routes',
	'app.config',
	'app.partials',
	'exceptionOverride'
] );

angular.module( 'app.run', [] );
angular.module( 'app.routes', [] );
angular.module( 'app.filters', [] );
angular.module( 'app.services', ['ui-leaflet'] );
angular.module( 'app.config', ['ngCookies'] );
angular.module( 'app.directives', [] );
angular.module( 'app.components', [
	'ui.router', 'ui.router.state.events', 'md.data.table', 'ngMaterial', 'angular-loading-bar',
	'restangular', 'ngStorage', 'satellizer', 'ui.tree', 'dndLists', 'angular.filter', 'textAngular',
	'ngSanitize', 'flow', 'ngMessages', 'mgo-angular-wizard', 'bw.paging',
	'pascalprecht.translate', 'ui-leaflet', 'nemLogging'
] );

//
angular.module( 'exceptionOverride', [] ).config( function( $provide )
{
	$provide.decorator( "$exceptionHandler", function( $delegate, $injector  )
	{
		return function( exception, cause )
		{
			$delegate( exception, cause );

			//
			try
			{
				var toaster = $injector.get( 'ToastService' );

				if( toaster && exception )
				{
					//
					var UNHANDLED = "Possibly unhandled rejection: {";
					var msg = "" + exception;

					if( msg.startsWith( UNHANDLED ) )
					{
						msg = msg.substring( UNHANDLED.length - 1 );
					}

					msg = msg.substring( 0, 65 ) + " ... ";
					toaster.error( msg );
				}
			}
			catch( err )
			{
				//console.verbose( err );
			}
		};
	} );
} );