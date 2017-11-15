export class UserService
{
	/**
	 *
	 * @param {Restangular} API
	 * @param {AuthProvider} $auth
	 * @param {*} $rootScope
	 * @param {*} $q
	 */
	constructor( API,
	             $auth,
	             $rootScope,
	             $q, )
	{
		'ngInject';

		//
		this.API = API;
		this.$auth = $auth;
		this.$rootScope = $rootScope;
		this.$q = $q;

		// --------------------------- //

		//
		this.user = null;
		this.defer = null;

		this.roles = [];
		this.providers = [];
		this.languages = ["de","en","ar","fa","fr"];

		//
		this.users = [];
		this.numItems = 0;

		//
		if( this.$auth.isAuthenticated() )
		{
			this.$rootScope.isLoading = true;

			let userPromise = this.fetchUser();
			let providerPromise = this.fetchProviders();

			this.$q.all( [userPromise, providerPromise] )
				.then( () =>
					{
						this.$rootScope.isLoading = false;
						this.$rootScope.$broadcast( 'userChanged', this );
					}
				);
		}
	}

	/**
	 * @param user {email,password}
	 */
	login( user )
	{
		this.$rootScope.isLoading = true;

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
			.then( () =>
				{
					this.$rootScope.isLoading = false;
					this.$rootScope.$broadcast( 'userChanged', this );
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
		this.roles.length = 0;

		return this.API.one( 'cms/users/me' ).get()
			.then( ( response ) =>
				{
					this.user = response;

					//
					this.roles.push.apply( this.roles, this.user.roles );
					this.user.roles = [];

					for( let j = 0; j < this.roles.length; j++ )
						this.user.roles.push( this.roles[j].name );

					//
					this.languages.length = 0;

					for( let j = 0; j < this.user.languages.length; j++ )
						this.languages.push( this.user.languages[j].language );
				},
				( error ) =>
				{
					throw error;
				} );
	}

	//
	fetchProviders()
	{
		this.providers.length = 0;

		return this.API.all( 'cms/providers' ).getList()
			.then( ( response ) =>
				{
					this.providers.push.apply( this.providers, response );
					console.log( "providers:", this.providers );
				},
				( error ) =>
				{
					throw error;
				} );
	}

	// ------------------------------------------------------ //
	// ------------------------------------------------------ //

	//
	fetchList( query )
	{
		let config = this.prepareQuery();

		//
		return this.API.all( 'cms/users' ).withHttpConfig( config ).getList( query )
			.then( ( response ) =>
			{
				this.numItems = response.count;

				this.users.length = 0;
				this.users.push.apply( this.users, response );

				this.resolveQuery();
			} )
			;
	}

	/**
	 *
	 * @param userList
	 */
	deleteList( userList )
	{
		let config = this.prepareQuery();
		let promises = [];

		//
		angular.forEach( userList, ( item ) =>
		{
			let promise = this.API.one( 'cms/users', item.id ).withHttpConfig( config ).remove()
				.then( ( response ) =>
					{
						if( response.data && response.data.user )
						{
							let index = this.indexOf( response.data.user.id );

							if( index !== -1 )
								this.users.splice( index, 1 );
						}
					},
					( error ) =>
					{
						throw error;
					}
				);

			promises.push( promise );
		} );

		//
		return this.$q.all( promises )
			.then( () =>
			{
				this.resolveQuery();
			} );
	}

	/**
	 *
	 * @param userList
	 */
	updateList( userList )
	{
		let config = this.prepareQuery();
		let promises = [];

		//
		angular.forEach( userList, ( item ) =>
		{
			let promise = this.API.one( 'cms/users', item.id ).withHttpConfig( config ).customPUT( item )
				.then( ( response ) =>
					{
						return response;
					},
					( error ) =>
					{
						throw error;
					}
				);

			promises.push( promise );
		} );

		//
		return this.$q.all( promises )
			.then( () =>
			{
				this.resolveQuery();
			} );
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	//
	indexOf( userID )
	{
		let result = -1;

		angular.forEach( this.users, ( user, index ) =>
		{
			if( user.id === userID )
				result = index;
		} );

		return result;
	}

	prepareQuery()
	{
		if( this.$rootScope.isLoading )
			console.log("query already in process");

		this.$rootScope.isLoading = true;

		//
		if( this.defer !== null )
			this.defer.resolve();

		//
		this.defer = this.$q.defer();

		return {
			timeout: this.defer.promise
		};
	}

	resolveQuery()
	{
		this.defer = null;

		this.$rootScope.isLoading = false;
		this.$rootScope.$broadcast( 'usersChanged', this );
	}

	// ------------------------------------------------------ //
	// ------------------------------------------------------ //

	/**
	 * Check whether user holds organisation role (but no superadmin/admin roles)
	 * @returns {boolean}
	 */
	isNgoUser()
	{
		if( !this.user )
			return false;

		let isOrgAdmin = Boolean( this.user.roles.indexOf( "organisation-admin" ) > -1 );
		let isOrgUser = Boolean( this.user.roles.indexOf( "organisation-user" ) > -1 );
		let isSuperAdmin = Boolean( this.user.roles.indexOf( "superadmin" ) > -1 );
		let isAdmin = this.user.roles.indexOf( "admin" ) > -1;

		return (isOrgAdmin || isOrgUser && !isSuperAdmin && !isAdmin);
	}

	isNgoAdministrator()
	{
		if( !this.user )
			return false;

		let isOrgAdmin = Boolean( this.user.roles.indexOf( "organisation-admin" ) > -1 );
		let isSuperAdmin = Boolean( this.user.roles.indexOf( "superadmin" ) > -1 );
		let isAdmin = this.user.roles.indexOf( "admin" ) > -1;

		return (isOrgAdmin && !isSuperAdmin && !isAdmin);
	}

	//
	isAdministrator()
	{
		if( !this.user )
			return false;

		let isSuperAdmin = Boolean( this.user.roles.indexOf( "superadmin" ) > -1 );
		let isAdmin = this.user.roles.indexOf( "admin" ) > -1;

		return isSuperAdmin || isAdmin;
	}

	//
	isModerator()
	{
		if( !this.user )
			return false;

		return ( this.user.roles.indexOf( 'moderator' ) > -1);
	}

	//
	getProviderByID( id )
	{
		let result = null;

		angular.forEach( this.providers, ( item ) =>
		{
			if( item.id === id )
				result = item;
		} );

		return result;
	}
}
