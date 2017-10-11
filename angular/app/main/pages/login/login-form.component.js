class LoginFormController
{
	/**
	 * @param {UserService} UserService
	 * @param {ToastService} ToastService
	 * * @param {*} $state
	 */
	constructor( UserService, ToastService, $state )
	{
		'ngInject';

		this.UserService = UserService;
		this.ToastService = ToastService;
		this.$state = $state;

		this.email = '';
		this.password = '';
	}

	login()
	{
		let user = {
			email: this.email,
			password: this.password
		};

		//
		this.UserService.login( user )
			.then( () =>
			{
				this.ToastService.show( 'Sie haben sich erfolgreich angemeldet.' );
				this.gotoCMS();
			} )
			.catch( this.failedLogin.bind( this ) );
	}

	//
	gotoCMS()
	{
		if( this.UserService.isModerator() )
		{
			this.$state.go( 'cms.translations' );
		}
		else
		{
			this.$state.go( 'cms.dashboard' );
		}
	}

	//
	failedLogin( response )
	{
		if( response.data )
		{
			this.ToastService.error( response.statusText );

			if( response.data.errors && response.data.errors.message )
			{
				response.data.errors.message.forEach( function( element )
				{
					this.ToastService.error( element );
				}, this );
			}
		}
		else
		{
			this.ToastService.error( response.message );
		}
	}
}

export const LoginFormComponent = {
	template: require('./login-form.component.html'),
	controller: LoginFormController,
	controllerAs: 'vm',
	bindings: {}
}