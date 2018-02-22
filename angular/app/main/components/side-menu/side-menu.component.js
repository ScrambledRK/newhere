class SideMenuController
{
	/**
	 * @param {*} $mdSidenav
	 * @param {*} $state
	 * @param {*} $auth
	 * @param {ToastService} ToastService
	 */
	constructor( $mdSidenav,
	             $state,
	             $auth,
	             RoutingService,
	             ToastService )
	{
		'ngInject';

		//
		this.$mdSidenav = $mdSidenav;
		this.$state = $state;
		this.$auth = $auth;

		this.ToastService = ToastService;
		this.RoutingService = RoutingService;
	}

	//
	close()
	{
		this.$mdSidenav( 'side-menu' ).close();
	}

	//
	logout()
	{
		this.$auth.logout().then( ( response ) =>
		{
			this.ToastService.show( 'Erfolgreich abgemeldet.' );
			this.$state.go( 'main.landing' );
		} );
	}

	isAuthenticated()
	{
		return this.$auth.isAuthenticated();
	}

	//
	getURL( type )
	{
		if( type === 'provider' )
		{
			return this.RoutingService.getProviderURL( 'all' );
		}
		else
		{
			return this.RoutingService.getContentURL( null, null );
		}
	}

	//
	goURL( type )
	{
		if( type === 'provider' )
		{
			this.RoutingService.goProvider( 'all' );
		}
		else
		{
			this.RoutingService.goContent( null, null );
		}
	}
}

//
export const SideMenuComponent = {
	template: require('./side-menu.component.html'),
	controller: SideMenuController,
	controllerAs: 'vm',
	bindings: {}
};
