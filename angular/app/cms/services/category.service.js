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

		// --------------------------- //

		//
		this.category = {};

		//
		this.fetchCategories();
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
					for(let k in response[0])
						this.category[k] = response[0][k];

					this.setupCategories( this.category, null );

					//
					this.$rootScope.$broadcast( 'categoriesChanged', this );
				},
				( msg ) =>
				{
					console.log( "fetch categories canceled/error", msg );
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

}
