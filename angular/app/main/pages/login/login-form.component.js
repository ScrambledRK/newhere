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
			.then( ( response ) =>
			{
				this.ToastService.show( 'Sie haben sich erfolgreich angemeldet.' );
				this.gotoCMS();
			} )
			.catch( this.failedLogin.bind( this ) );
	}

	//
	gotoCMS()
	{
		if( this.isModerator( this.UserService.roles ) )
		{
			this.$state.go( 'cms.translations' );
		}
		else
		{
			this.$state.go( 'cms.dashboard' );
		}
	}

	/**
	 * Check whether user holds organisation role (but no superadmin/admin roles)
	 * @param roles
	 * @returns {boolean}
	 */
	isNgoUser( roles )
	{
		let isOrgAdmin = Boolean(roles.indexOf( "organisation-admin" ) > -1);
		let isOrgUser = Boolean(roles.indexOf( "organisation-user" ) > -1);
		let isSuperAdmin = Boolean(roles.indexOf( "superadmin" ) > -1);
		let isAdmin = roles.indexOf( "admin" ) > -1;

		return (isOrgAdmin || isOrgUser && !isSuperAdmin && !isAdmin);
	}

	//
	isModerator( roles )
	{
		return (roles.indexOf( 'moderator' ) > -1);
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