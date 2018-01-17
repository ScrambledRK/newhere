class UserMenuController
{
	constructor( $auth, $state, ToastService )
	{
		'ngInject';

		//
		this.$auth = $auth;
		this.$state = $state;
		this.ToastService = ToastService;
	}

	profile()
	{
		this.$state.go( "cms.dashboard", {tab:1} );
	}

	logout()
	{
		this.$auth.logout().then( () =>
		{
			this.ToastService.show( 'Erfolgreich abgemeldet.' );
			this.$state.go( 'main.landing' );
		} );
	}
}

export const UserMenuComponent = {
	template: require('./cms-user-menu.component.html'),
	controller: UserMenuController,
	controllerAs: 'vm',
	bindings: {}
};