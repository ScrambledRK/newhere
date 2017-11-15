export class TranslationService
{
	/**
	 */
	constructor( API,
	             $rootScope,
	             $q,
	             UserService )
	{
		'ngInject';

		//
		this.API = API;
		this.$rootScope = $rootScope;
		this.$q = $q;

		this.UserService = UserService;
		this.defer = null;

		// --------------------------- //

		this.languages = this.UserService.languages;

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
		return this.API.one( 'cms/translations', type ).withHttpConfig( config ).get( query )
			.then( ( response ) =>
			{
				console.log( response );

				this.numItems = response.data.count;
				this.setResult( type, response.data.result );

				this.resolveQuery();
			} )
		;
	}

	//
	setResult( type, response )
	{
		this.translations.length = 0;

		switch( type )
		{
			case "offer":
			{
				this.setOfferResult( response );
				break;
			}

			case "provider":
			{
				this.setProviderResult( response );
				break;
			}

			case "filter":
			{
				this.setFilterResult( response );
				break;
			}

			case "category":
			{
				this.setCategoryResult( response );
				break;
			}
		}
	}

	//
	setOfferResult( response )
	{
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

	//
	setProviderResult( response )
	{
		angular.forEach( response, ( item, index ) =>
		{
			let entry =
				    {
					    id : item.id,
					    title : item.organisation,
					    tooltip : item.description,
					    enabled : item.published,
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

	//
	setFilterResult( response )
	{
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

	//
	setCategoryResult( response )
	{
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
		this.$rootScope.$broadcast( 'translationsChanged', this );
	}
}
