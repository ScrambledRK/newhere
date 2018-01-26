export class PageService
{
	/**
	 */
	constructor( API,
	             $rootScope,
	             $q, )
	{
		'ngInject';

		//
		this.API = API;
		this.$rootScope = $rootScope;
		this.$q = $q;

		this.defer = null;

		// --------------------------- //

		//
		this.pages = [];
		this.numItems = 0;
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	//
	all()
	{
		let config = this.prepareQuery();

		return this.API.all( 'cms/pages/all' ).withHttpConfig( config ).getList()
			.then( ( response ) =>
			{
				this.numItems = response.count;

				this.pages.length = 0;
				this.pages.push.apply( this.pages, response );

				this.resolveQuery();
			} )
		;
	}

	//
	fetchList( query )
	{
		let config = this.prepareQuery();

		//
		return this.API.all( 'cms/pages' ).withHttpConfig( config ).getList( query )
			.then( ( response ) =>
			{
				this.numItems = response.count;

				this.pages.length = 0;
				this.pages.push.apply( this.pages, response );

				this.resolveQuery();
			} )
			;
	}

	/**
	 *
	 * @param pagesList
	 */
	deleteList( pagesList )
	{
		let config = this.prepareQuery();
		let promises = [];

		//
		angular.forEach( pagesList, ( item ) =>
		{
			let promise = this.API.one( 'cms/pages', item.id ).withHttpConfig( config ).remove()
				.then( ( response ) =>
					{
						if( response.data && response.data.offer )
						{
							let index = this.indexOf( response.data.page.id );

							if( index !== -1 )
								this.pages.splice( index, 1 );
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
	 * @param pagesList
	 */
	updateList( pagesList )
	{
		let config = this.prepareQuery();
		let promises = [];

		//
		angular.forEach( pagesList, ( item ) =>
		{
			let promise = this.API.one( 'cms/pages', item.id ).withHttpConfig( config ).customPUT( item )
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
	indexOf( pageID )
	{
		let result = -1;

		angular.forEach( this.pages, ( page, index ) =>
		{
			if( page.id === pageID )
				result = index;
		} );

		return result;
	}

	prepareQuery()
	{
		//if( this.$rootScope.isLoading )
		//	console.log("query already in process");

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
		this.$rootScope.$broadcast( 'pagesChanged', this );
	}
}
