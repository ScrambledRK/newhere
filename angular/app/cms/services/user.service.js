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
		this.user = null;

		this.roles = [];
		this.providers = [];

		//
		if( this.$auth.getToken() )
		{
			this.fetchUser();
			this.fetchProviders();
		}
	}

	/**
	 * @param user {email,password}
	 */
	login( user )
	{
		return this.$auth.login( user )
			.then( ( response ) =>
				{
					this.$auth.setToken( response.data );
				},
				( error ) =>
				{
					throw error;
				} )
			.then( () =>
				{
					return this.fetchUser()
				},
				( error ) =>
				{
					throw error;
				} )
			.then( () =>
				{
					return this.fetchProviders()
				},
				( error ) =>
				{
					throw error;
				} )
			;
	}

	//
	fetchUser()
	{
		return this.API.one( 'cms/users/me' ).get()
			.then( ( response ) =>
				{
					this.user = response;
					this.roles = this.user.roles;
				},
				( error ) =>
				{
					throw error;
				} );
	}

	//
	fetchProviders()
	{
		return this.API.all( 'cms/providers' ).getList()
			.then( ( response ) =>
				{
					this.providers = response;
				},
				( error ) =>
				{
					throw error;
				} );
	}

	/**
	 * Check whether user holds organisation role (but no superadmin/admin roles)
	 * @returns {boolean}
	 */
	isNgoUser()
	{
		if( !this.roles )
			return false;

		let isOrgAdmin = Boolean( this.roles.indexOf( "organisation-admin" ) > -1);
		let isOrgUser = Boolean( this.roles.indexOf( "organisation-user" ) > -1);
		let isSuperAdmin = Boolean( this.roles.indexOf( "superadmin" ) > -1);
		let isAdmin = this.roles.indexOf( "admin" ) > -1;

		return (isOrgAdmin || isOrgUser && !isSuperAdmin && !isAdmin);
	}

	//
	isModerator()
	{
		if( !this.roles || this.roles.length === 0 )
			return false;

		return ( this.roles.indexOf( 'moderator' ) > -1);
	}
}
