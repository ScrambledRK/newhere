export class ContentService
{
	/**
	 *
	 * @param {Restangular} API
	 * @param {*} $state
	 * @param {*} $translate
	 * @param {*} $rootScope
	 * @param {*} $q
	 */
	constructor( API,
	             $state,
	             $translate,
	             $rootScope,
	             $q, )
	{
		'ngInject';

		//
		this.API = API;

		this.$state = $state;
		this.$translate = $translate;
		this.$rootScope = $rootScope;
		this.$q = $q;

		// --------------------------- //

		//
		this.$rootScope.$on( "languageChanged", ( event, data ) =>
		{
			this.onLanguageChanged();
		} );

		//
		this.$rootScope.$on( "$stateChangeStart", ( event, toState, toParams, fromState, fromParams ) =>
		{
			this.onStateChanged( fromState, toState, toParams );
		} );

		// --------------------------- //

		//
		this.defer = null;

		//
		this.category = { slug: "start" };
		this.provider = null;
		this.offer = null;

		this.categoryList = null;
		this.providerList = null;
		this.offerList = null;
		this.markerList = null;

		//
		this.slugCategory = null;
		this.slugProvider = null;
		this.slugOffer = null;

		//
		this.onStateChanged( this.$state, this.$state, this.$state.params );
	}

	/**
	 *
	 */
	onLanguageChanged()
	{
		this.fetchContent(
			this.slugCategory,
			this.slugProvider,
			this.slugOffer,
			true
		);
	}

	/**
	 *
	 * @param toState
	 * @param toParams
	 */
	onStateChanged( fromState, toState, toParams )
	{
		let paramCategory = toParams.category;
		let paramProvider = toParams.provider;
		let paramOffer = toParams.offer;

		if( toState.name === "main.content.offers" )
		{
			if( toState.name !== fromState.name )
				this.slugProvider = null;

			paramProvider = null;

			if( !paramCategory || paramCategory === "" )
				console.error( "content.toState requires category parameter to be set" );
		}

		if( toState.name === "main.content.providers" )
		{
			if( toState.name !== fromState.name )
				this.slugCategory = this.slugOffer = null;

			paramCategory = null;
			paramOffer = null;

			if( !paramProvider )
				console.error( "content.toState requires provider parameter to be set" );
		}

		//
		this.fetchContent(
			paramCategory,
			paramProvider,
			paramOffer,
			true
		);
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	/**
	 *
	 * @param {string} slugCategory
	 * @param {string} slugProvider
	 * @param {string} slugOffer
	 * @param {boolean} force
	 */
	fetchContent( slugCategory, slugProvider, slugOffer, force )
	{
		this.$rootScope.isLoading = true;

		//
		if( this.defer !== null )
			this.defer.resolve();

		//
		this.defer = this.$q.defer();

		let config = {
			timeout: this.defer.promise
		};

		// ------------- //

		let categoryPromise = this.fetchCategory( slugCategory, config, force );
		let providerPromise = this.fetchProvider( slugProvider, config, force );
		let offerPromise = this.fetchOffer( slugOffer, config, force );

		this.$q.all( [categoryPromise, providerPromise, offerPromise] )
			.then( () =>
				{
					//console.log( "fetch content complete" );

					this.defer = null;

					this.$rootScope.isLoading = false;
					this.$rootScope.$broadcast( 'contentChanged', this );
				},
				( msg ) =>
				{
					//console.log( "fetch content canceled/error", msg );
				} );
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //
	// CATEGORY

	/**
	 *
	 * @param {string} slugCategory
	 * @param {*} config
	 * @param {boolean} force
	 *
	 * @return {promise}
	 */
	fetchCategory( slugCategory, config, force )
	{
		//console.log( "fetching categories: ", slugCategory );

		if( !slugCategory )
			return this.$q.when();

		if( !force && slugCategory === this.slugCategory )
			return this.$q.when();

		this.slugCategory = slugCategory;

		// ---------- //

		//
		let query = {
			withChildren: true,
			withParents: true,
			withOffers: true
		};

		//
		return this.API.one( "categories", this.slugCategory ).withHttpConfig( config ).get( query )
			.then( ( response ) =>
				{
					if( !response.length )
						return;

					//
					this.category = response[0];
					this.categoryList = this.category.children;
					this.offerList = this.category.offers;
					this.markerList = this.category.offers;

					//
					for( let j = 1; j < response.length; j++ )
					{
						if( response[j].children )
							this.categoryList.push.apply( this.categoryList, response[j].children );
					}
				},
				( msg ) =>
				{
					//console.log( "fetch categories canceled/error", msg );
				} );
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //
	// PROVIDERS

	/**
	 *
	 * @param {string} slugProvider
	 * @param {*} config
	 * @param {boolean} force
	 *
	 * @return {promise}
	 */
	fetchProvider( slugProvider, config, force )
	{
		//console.log( "fetching providers: ", slugProvider );

		if( !slugProvider )
			return this.$q.when();

		if( !force && slugProvider === this.slugProvider )
			return this.$q.when();

		this.slugProvider = slugProvider;

		// ---------- //

		if( slugProvider === 'all' )
			return this.fetchProviderList( config );

		return this.fetchProviderDetail( config );
	}

	//
	fetchProviderList( config )
	{
		//
		let query = {
			published: true,
		};

		return this.API.all( "providers" ).withHttpConfig( config ).getList( query )
			.then( ( response ) =>
				{
					if( !response.length )
						return;

					//
					this.providerList = response;
				},
				( msg ) =>
				{
					//console.log( "fetch provider.list canceled/error", msg );
				} );
	}

	//
	fetchProviderDetail( config )
	{
		//
		let query = {
			withOffers: true
		};

		return this.API.one( "providers", this.slugProvider ).withHttpConfig( config ).get( query )
			.then( ( response ) =>
				{
					this.provider = response;
					this.offerList = this.provider.offers;
					this.markerList = this.provider.offers;
				},
				( msg ) =>
				{
					//console.log( "fetch provider.detail canceled/error", msg );
				} );
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //
	// OFFERS

	/**
	 *
	 * @param {string} slugOffer
	 * @param {*} config
	 * @param {boolean} force
	 *
	 * @return {promise}
	 */
	fetchOffer( slugOffer, config, force )
	{
		//console.log( "fetching offer: ", slugOffer );

		this.offer = null;

		//
		if( !slugOffer )
			return this.$q.when();

		if( !force && slugOffer === this.slugOffer )
			return this.$q.when();

		this.slugOffer = slugOffer;

		// ---------- //

		//
		return this.API.one( "offers", this.slugOffer ).withHttpConfig( config ).get()
			.then( ( response ) =>
				{
					this.offer = response;
				},
				( msg ) =>
				{
					//console.log( "fetch offer canceled/error", msg );
				} );
	}

}
