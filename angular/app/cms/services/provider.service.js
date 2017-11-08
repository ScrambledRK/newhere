export class ProviderService
{
	/**
	 */
	constructor( API,
	             UserService,
	             $rootScope,
	             $q, )
	{
		'ngInject';

		//
		this.API = API;
		this.UserService = UserService;
		this.$rootScope = $rootScope;
		this.$q = $q;

		// --------------------------- //

		//
		this.providers = [];
		this.numItems = 0;
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	//
	fetchList( query )
	{
		let config = this.prepareQuery();

		//
		return this.API.all( 'cms/providers' ).withHttpConfig( config ).getList( query )
			.then( ( response ) =>
			{
				this.numItems = response.count;

				this.providers.length = 0;
				this.providers.push.apply( this.providers, response );

				this.resolveQuery();
			} )
		;
	}

	/**
	 *
	 * @param providerList
	 */
	deleteList( providerList )
	{
		let config = this.prepareQuery();
		let promises = [];

		//
		angular.forEach( providerList, ( item ) =>
		{
			let promise = this.API.one( 'cms/providers', item.id ).withHttpConfig( config ).remove()
				.then( ( response ) =>
					{
						if( response.data && response.data.provider )
						{
							let index = this.indexOf( response.data.provider.id );

							if( index !== -1 )
								this.providers.splice( index, 1 );
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
			});
	}

	/**
	 *
	 * @param providerList
	 */
	updateList( providerList )
	{
		let config = this.prepareQuery();
		let promises = [];

		//
		angular.forEach( providerList, ( item ) =>
		{
			let promise = this.API.one( 'cms/providers', item.id ).withHttpConfig( config ).customPUT( item )
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
			});
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	//
	indexOf( providerID )
	{
		let result = -1;

		angular.forEach( this.providers, ( provider, index ) =>
		{
			if( provider.id === providerID )
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
		let defer = this.$q.defer();

		return {
			timeout: defer.promise
		};
	}

	resolveQuery()
	{
		this.$rootScope.isLoading = false;
		this.$rootScope.$broadcast( 'providersChanged', this );
	}
}
