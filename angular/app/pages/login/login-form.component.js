class LoginFormController
{
	/**
	 * @param {*} $auth
	 * @param {*} $state
	 * @param {*} $window
	 * @param {*} $translate
	 * @param {ToastService} ToastService
	 */
	constructor( $auth, $state, $window, $translate, ToastService )
	{
		'ngInject';

		this.$window = $window;
		this.$auth = $auth;
		this.$state = $state;
		this.$translate = $translate;
		this.ToastService = ToastService;

		this.email = '';
		this.password = '';
	}

	login()
	{
		let user = {
			email: this.email,
			password: this.password
		};

		this.$auth.login( user )
			.then( ( response ) =>
			{
				let roles = [];
				this.$auth.setToken( response.data );

				angular.forEach( response.data.data.user.roles, function( role )
				{
					roles.push( role.name );
				} );

				this.$window.localStorage.roles = JSON.stringify( roles );
				this.ToastService.show( 'Sie haben sich erfolgreich angemeldet.' );

				this.gotoCMS();
			} )
			.catch( this.failedLogin.bind( this ) );
	}

	//
	gotoCMS()
	{
		if( this.isModerator( roles ) )
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

	isModerator( roles )
	{
		return (roles.indexOf( 'moderator' ) > -1);
	}

	failedLogin( response )
	{
		if( response.data.errors && response.data.errors.message )
		{
			response.data.errors.message.forEach( function( element )
			{
				this.ToastService.error( element );
			}, this );
		}

		this.ToastService.error( response.statusText );
	}
}

export const LoginFormComponent = {
	template: require('./login-form.component.html'),
	controller: LoginFormController,
	controllerAs: 'vm',
	bindings: {}
}