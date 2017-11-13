export class TranslationService
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

		this.languages = ["de","en","ar","fa","fr"];

		//
		this.translations = [];
		this.numItems = 0;
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	//
	fetchList( type, query )
	{
		let config = this.prepareQuery();

		//
		return this.API.all( 'cms/translations' ).withHttpConfig( config ).getList( query )
			.then( ( response ) =>
			{
				this.numItems = response.count;
				this.setResult( response );

				this.resolveQuery();
			} )
		;
	}

	//
	setResult( response )
	{
		this.translations.length = 0;

		angular.forEach( response, ( item, index ) =>
		{
			let entry =
				    {
				    	id : item.id,
					    title : item.title,
					    tooltip : item.description,
					    enabled : item.enabled,
					    translations : {}
				    };

			this.translations.push( entry );

			//
			angular.forEach( item.translations, ( translation, index ) =>
			{
				entry.translations[translation.locale] = translation;
				translation.tooltip = translation.description;
			} );

			console.log( entry );
		} );
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

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
