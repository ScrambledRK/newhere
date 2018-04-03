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
			DocumentService.isDirty = true;

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
	let onStateChangeEnd = $rootScope.$on( "$locationChangeSuccess",
		( event, toState, toParams, fromState, fromParams ) =>
		{
			let url = $location.url();
			//	url = url.split("#!")[1];

			if( url && url.length > 0 )
			{
				if( DocumentService.isDirty )
				{
					DocumentService.onComplete = (title) => {
						AnalyticService.visitPage( url, document.title );
					};
				}
				else
				{
					AnalyticService.visitPage( url, document.title );
				}
			}

		} );

	//
	$rootScope.$on( '$destroy', () =>
	{
		onStateChangeStart();
		onStateChangeEnd();
		onTracking();
	} );
}