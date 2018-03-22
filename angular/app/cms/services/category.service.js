export class CategoryService
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
		this.category = {};

		//
		//this.fetchCategories();

		//
		this.$rootScope.$on( "languageChanged", ( event, data ) =>
		{
			this.fetchCategories();
		} );
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	//
	fetchCategories()
	{
		//
		let query = {
			withChildren: true
		};

		//
		return this.API.one( "cms/categories", "start" ).get( query )
			.then( ( response ) =>
				{
					if( !response.length )
						return;

					//
					for( let k in response[0] )
						this.category[k] = response[0][k];

					this.setupCategories( this.category, null );

					//
					this.$rootScope.$broadcast( 'categoriesChanged', this );
				},
				( msg ) =>
				{
					//console.log( "fetch categories canceled/error", msg );
				} );
	}

	//
	setupCategories( node, parent )
	{
		node.parent = parent;

		//
		angular.forEach( node.all_children, ( child, key ) =>
		{
			this.setupCategories( child, node );
		} );
	}

	/**
	 *
	 * @param categoryList
	 */
	updateList( categoryList )
	{
		let config = this.prepareQuery();
		let promises = [];

		//
		angular.forEach( categoryList, ( item ) =>
		{
			let payload = {
				id : item.id,
				page_id : item.page_id
			};

			let promise = this.API.one( 'cms/categories/', payload.id )
				.withHttpConfig( config ).customPUT( payload )
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
				},
				( error ) =>
				{
					throw error;
				} );
	}

	//
	prepareQuery()
	{
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
		//this.$rootScope.$broadcast( 'pagesChanged', this );
	}
}
