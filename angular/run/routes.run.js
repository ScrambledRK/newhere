export function RoutesRun( $rootScope,
                           $state,
                           $auth,
                           $window,
                           $mdComponentRegistry,
                           $mdSidenav,
                           $translate,
                           ToastService )
{
	'ngInject';

	$rootScope.cms = false;

	//
	let deregisterationCallback = $rootScope.$on( "$stateChangeStart",
		function( event, toState, toParams, fromState, fromParams )
		{
			$rootScope.cms = toState.name.indexOf( 'cms' ) > -1;

			$rootScope.fromState = fromState;
			$rootScope.fromParams = fromParams;
			$rootScope.$auth = $auth;

			//
			if( toState.data && toState.data.auth )
			{
				/*Cancel going to the authenticated state and go back to the login page*/
				if( !$auth.isAuthenticated() )
				{
					event.preventDefault();
					return $state.go( 'app.login' );
				}
				else if( toState.data.roles )
				{
					let roles = $window.localStorage.roles;

					if( toState.data.roles.indexOf( angular.fromJson( roles )[0] ) === -1 )
					{
						event.preventDefault();

						ToastService.error( 'Sie sind zum Aufruf dieser Seite nicht berechtigt!' );
						$state.go( 'main.landing' );
					}
				}
			}

			//
			if( $mdComponentRegistry.get( 'side-menu' ) )
				$mdSidenav( 'side-menu' ).close();

		} );

	//
	$rootScope.$on( '$destroy', deregisterationCallback );
}