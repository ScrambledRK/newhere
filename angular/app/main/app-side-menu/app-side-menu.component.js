class AppMainMenuController
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
	$onInit()
	{
	}

	//
	closeMainMenu()
	{
		this.$mdSidenav( 'main-menu' ).close();
	}

	//
	logout()
	{
		this.$auth.logout().then( ( response ) =>
		{
			this.ToastService.show( 'Erfolgreich abgemeldet.' );
			this.$state.go( 'app.landing' );
		} );
	}

}

export const AppMainMenuComponent = {
	templateUrl: './views/app/main/app-side-menu/app-side-menu.component.html',
	controller: AppMainMenuController,
	controllerAs: 'vm',
	bindings: {}
}
