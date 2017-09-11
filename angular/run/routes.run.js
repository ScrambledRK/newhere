export function RoutesRun( $rootScope,
                           $translate,
                           $mdComponentRegistry,
                           $mdSidenav )
{
	'ngInject';


	//
	let onStateChangeStart = $rootScope.$on( "$stateChangeStart",
		function( event, toState, toParams, fromState, fromParams )
		{
			if( !$rootScope.language )
				$rootScope.language = $translate.preferredLanguage();

			if( $mdComponentRegistry.get( 'side-menu' ) )
				$mdSidenav( 'side-menu' ).close();
		} );

	//
	$rootScope.$on( '$destroy', onStateChangeStart );
}