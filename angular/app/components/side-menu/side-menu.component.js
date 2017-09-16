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
	             ToastService )
	{
		'ngInject';

		//
		this.$mdSidenav = $mdSidenav;
		this.$state = $state;
		this.$auth = $auth;

		this.ToastService = ToastService;
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
}

//
export const SideMenuComponent = {
	template: require('./side-menu.component.html'),
	controller: SideMenuController,
	controllerAs: 'vm',
	bindings: {}
};
