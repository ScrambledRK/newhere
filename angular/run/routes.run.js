export function RoutesRun( $rootScope,
                           $translate,
                           $mdComponentRegistry,
                           $mdSidenav,
                           ToastService,
                           $auth,
                           $state )
{
	'ngInject';

	//
	let onStateChangeStart = $rootScope.$on( "$stateChangeStart",
		( event, toState, toParams, fromState, fromParams ) =>
		{
			if( toState.data && toState.data.auth )
			{
				if( !$auth.isAuthenticated() )
				{
					event.preventDefault();

					ToastService.error( 'Session expired!' );

					return $state.go( 'main.login' );
				}
			}

			// ------------------------------- //
			// ------------------------------- //

			$rootScope.$state = toState;
			$rootScope.$stateParams = toParams;

			if( !$rootScope.language )
				$rootScope.language = $translate.preferredLanguage();

			if( $rootScope.isTextAlignmentLeft == null ) // == undefined/null
				$rootScope.isTextAlignmentLeft = true;

			if( !$rootScope.isLoading )
				$rootScope.isLoading = true;

			if( $mdComponentRegistry.get( 'side-menu' ) )
				$mdSidenav( 'side-menu' ).close();
		} );

	//
	$rootScope.$on( '$destroy', onStateChangeStart );
}