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

/**
 *
 * @type {{templateUrl: string, controller: AppMainMenuController, controllerAs: string, bindings: {}}}
 */
export const AppMainMenuComponent = {
	templateUrl: './views/app/main/side-menu/side-menu.component.html',
	controller: AppMainMenuController,
	controllerAs: 'vm',
	bindings: {}
};
