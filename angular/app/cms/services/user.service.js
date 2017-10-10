export class UserService
{
	/**
	 *
	 * @param {Restangular} API
	 * @param {ToastService} ToastService
	 * @param {AuthProvider} $auth
	 * @param {*} $q
	 */
	constructor( API,
	             $auth,
	             $q, )
	{
		'ngInject';

		//
		this.API = API;
		this.$auth = $auth;
		this.$q = $q;

		// --------------------------- //

		//
		this.defer = null;
		this.roles = null;
	}

	/**
	 * @param user {email,password}
	 */
	login(user)
	{
		return this.$auth.login( user )
			.then( ( response ) =>
			{
				let roles = [];
				this.$auth.setToken( response.data );

				angular.forEach( response.data.data.user.roles, function( role )
				{
					roles.push( role.name );
				} );

				this.roles = roles;

				//
				return response;
			},
			(error) =>
			{
				throw error;
			} )
		;
	}

}
