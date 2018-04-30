/**
 * the actual form is a dialog, this is just
 */
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

		this.isTranslateOnSave = false;
		this.enabledLanguages = ["de","en","ar","fa","fr"];
		this.defaultLanguage = "de";

		//
		this.translations = [];
		this.numItems = 0;

		// --------------------------- //
		// pages tinymce

		//
		this.tinyOptions = {
			plugins: 'link autolink code image',
			toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
		}
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
				//console.log( response );

				this.numItems = response.data.count;
				this.setResult( type, response.data.result );

				this.resolveQuery();
			} )
		;
	}

	/**
	 * trying to consolidate the data into a common form so translation forms
	 * can look somewhat similar.
	 *
	 * @param type
	 * @param response
	 */
	setResult( type, response )
	{
		this.translations.length = 0;

		//
		angular.forEach( response, ( item ) =>
		{
			angular.forEach( this.enabledLanguages, ( lang ) =>
			{
				let index = this.indexOf( lang, item.translations );

				if( index === -1 )  // no entry for the language? lets dummy it!
				{
					let dummy = {
						offer_id : item.id,
						ngo_id : item.id,
						filter_id : item.id,
						category_id : item.id,
						page_id : item.id,
						locale : lang,
						tooltip : "-",
						version : 0
					};

					item.translations.push( dummy ); // onto the response items itself
				}
			} );
		} );

		//
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

			case "page":
			{
				this.setPageResult( response );
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
					    updated_at : item.updated_at,
					    translations : {}
				    };

			this.translations.push( entry );

			//
			angular.forEach( item.translations, ( translation, index ) =>
			{
				entry.translations[translation.locale] = translation;

				translation.tooltip = translation.description ? translation.description : "-";
				translation.fields = [
					{
						label : "title",
						value : "title",
						rows: 1
					},
					{
						label : "description",
						value : "description",
						rows: 3
					},
					{
						label : "opening_hours",
						value : "opening_hours",
						rows: 5
					}
				];
			} );

			//console.log( entry );
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
					    updated_at : item.updated_at,
					    translations : {}
				    };

			this.translations.push( entry );

			//
			angular.forEach( item.translations, ( translation, index ) =>
			{
				entry.translations[translation.locale] = translation;

				translation.tooltip = translation.description ? translation.description : "-";
				translation.fields = [
					{
						label : "description",
						value : "description",
						rows: 3
					}
				];
			} );

			//console.log( entry );
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
					    updated_at : item.updated_at,
					    translations : {}
				    };

			this.translations.push( entry );

			//
			angular.forEach( item.translations, ( translation, index ) =>
			{
				entry.translations[translation.locale] = translation;

				translation.tooltip = translation.description ? translation.description : "-";
				translation.fields = [
					{
						label : "title",
						value : "title",
						rows: 1
					},
					{
						label : "description",
						value : "description",
						rows: 3
					}
				];
			} );

			//console.log( entry );
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
					    updated_at : item.updated_at,
					    translations : {}
				    };

			this.translations.push( entry );

			//
			angular.forEach( item.translations, ( translation, index ) =>
			{
				entry.translations[translation.locale] = translation;

				translation.tooltip = translation.description ? translation.description : "-";
				translation.fields = [
					{
						label : "title",
						value : "title",
						rows: 1
					},
					{
						label : "description",
						value : "description",
						rows: 3
					}
				];
			} );

			//console.log( entry );
		} );
	}

	//
	setPageResult( response )
	{
		angular.forEach( response, ( item, index ) =>
		{
			let entry =
				    {
					    id : item.id,
					    title : item.title,
					    tooltip : item.slug,
					    enabled : item.enabled,
					    updated_at : item.updated_at,
					    translations : {}
				    };

			this.translations.push( entry );

			//
			angular.forEach( item.translations, ( translation, index ) =>
			{
				entry.translations[translation.locale] = translation;

				translation.tooltip = translation.title ? translation.title : "-";
				translation.fields = [
					{
						label : "title",
						value : "title",
						rows: 1
					},
					{
						label : "content",
						value : "content",
						rows: 8
					}
				];
			} );

			//console.log( entry );
		} );
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	/**
	 *
	 * @param translationList
	 * @param type
	 */
	updateList( translationList, type )
	{
		let config = this.prepareQuery();
		let promises = [];

		//
		angular.forEach( translationList, ( item ) =>
		{
			//
			let itemID = null;

			switch( type )
			{
				case "offer":
				{
					itemID = item.offer_id;
					break;
				}

				case "provider":
				{
					itemID = item.ngo_id;
					break;
				}

				case "filter":
				{
					itemID = item.filter_id;
					break;
				}

				case "category":
				{
					itemID = item.category_id;
					break;
				}

				case "page":
				{
					itemID = item.page_id;
					break;
				}
			}

			//
			let promise = this.API.one( 'cms/translations/' + type + "/" + itemID ).withHttpConfig( config ).customPUT( item )
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
	indexOf( languageLocale, targetList )
	{
		if( !targetList )
			targetList = this.languages;

		//
		let result = -1;

		angular.forEach( targetList, ( filter, index ) =>
		{
			if( filter.locale === languageLocale )
				result = index;
		} );

		return result;
	}

	prepareQuery()
	{
		//if( this.$rootScope.isLoading )
			//console.log("query already in process");

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
