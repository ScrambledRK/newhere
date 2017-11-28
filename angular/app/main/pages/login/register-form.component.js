class RegisterFormController
{
	constructor( $auth,
	             $state,
	             $translate,
	             ToastService )
	{
		'ngInject';

		this.$auth = $auth;
		this.$state = $state;
		this.$translate = $translate;
		this.ToastService = ToastService;

		//
		this.sending = false;
		this.accept = false;

		this.user = {
			name: null,
			email: null,
			password: null,
			re_password: null
		};
	}

	//
	save()
	{
		this.sending = true;

		this.$auth.signup( this.user )
			.then( ( response ) =>
			{
				//this.$auth.setToken( response.data );

				this.ToastService.show( 'Registrierung erfolgreich.' );
				this.$state.go( 'main.login' );
			} )
			.catch( this.failedRegistration.bind( this ) );
	}

	//
	cancel()
	{
		this.$state.go( 'main.landing' );
	}

	//
	failedRegistration( response )
	{
		if( response.status === 422 )
		{
			for( var error in response.data.errors )
			{
				return this.ToastService.error( response.data.errors[error][0] );
			}
		}
		this.sending = false;
		this.ToastService.error( response.statusText );
	}
}

export const RegisterFormComponent = {
	template: require('./register-form.component.html'),
	controller: RegisterFormController,
	controllerAs: 'vm',
	bindings: {}
};