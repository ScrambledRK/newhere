export function RoutesRun( $rootScope,
                           $translate,
                           $mdComponentRegistry,
                           $mdSidenav,
                           ToastService,
                           AnalyticService,
                           DocumentService,
                           $location,
                           $auth,
                           $state )
{
	'ngInject';

	//
	let onStateChangeStart = $rootScope.$on( "$stateChangeStart",
		( event, toState, toParams, fromState, fromParams ) =>
		{
			DocumentService.invalidateTitle();

			//
			if( toState.data && toState.data.auth )
			{
				DocumentService.changeTitle("cms");

				//
				if( !$auth.isAuthenticated() )
				{
					event.preventDefault();

					ToastService.error( 'Session expired!' );

					return $state.go( 'main.login' );
				}
			}

			if( toState.data && toState.data.title )
				DocumentService.changeTitle( toState.data.title );

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
	$rootScope.$on( '$destroy', () =>
	{
		onStateChangeStart();
	} );
}