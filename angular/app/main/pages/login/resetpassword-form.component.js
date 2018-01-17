class ResetpasswordFormController
{
	constructor( $auth, $state, UserService, ToastService )
	{
		'ngInject';

		//
		this.$auth = $auth;
		this.$state = $state;
		this.UserService = UserService;
		this.ToastService = ToastService;

		//
		this.token = $state.params.token;
		this.sending = false;
	}

	//
	setNewPassword()
	{
		let data = {
			token: this.token,
			password: this.password,
			re_password: this.re_password
		};

		//
		this.sending = true;

		this.UserService.setNewPassword( data ).then( ( response ) =>
		{
			this.sending = false;

			if( this.$auth.isAuthenticated() )
			{
				this.$state.go( 'cms.dashboard', {tab:1} );
			}
			else
			{
				this.$state.go( 'main.login' );
			}

			this.ToastService.show( 'Das Passwort wurde erfolgreich gespeichert.' );
		} );
	}

	//
	$onInit()
	{
	}
}

export const ResetpasswordFormComponent = {
	template: require('./resetpassword-form.component.html'),
	controller: ResetpasswordFormController,
	controllerAs: 'vm',
	bindings: {}
}
