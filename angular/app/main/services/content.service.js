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
			this.onStateChanged( fromState, toState, fromParams, toParams );
		} );

		// --------------------------- //

		//
		this.defer = null;

		//
		this.category = { slug: "start" };
		this.provider = null;
		this.offer = null;

		this.categoryTree = null;
		this.categoryList = null;
		this.providerList = null;
		this.offerList = null;
		this.markerList = null;

		//
		this.slugCategory = null;
		this.slugProvider = null;
		this.slugOffer = null;

		//
		this.onStateChanged( this.$state, this.$state, this.$state.params, this.$state.params );
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
	onStateChanged( fromState, toState, fromParams, toParams )
	{
		//console.log("onStateChanged", fromState.name, toState.name, fromParams, toParams );

		//
		let paramCategory = toParams.category;
		let paramProvider = toParams.provider;
		let paramOffer = toParams.offer;

		if( toState.name === "main.content.offers" || (!toState.name && (paramCategory || paramOffer)))
		{
			if( toState.name !== fromState.name )
				this.slugProvider = null;

			//
			paramProvider = null;

			// {#: null, category: "start,providers,239", offer: "14"}
			if( toParams.category )
			{
				let split = toParams.category.split(",");

				if( split.length === 3 && split[0] === 'start' && split[1] === 'providers' )
				{
					paramProvider = split[2];
					paramCategory = 'providers';
				}
			}

			//
			if( !paramCategory || paramCategory === "" )
				console.error( "content.toState requires category parameter to be set" );
		}
		else if( toState.name === "main.content.providers" || (!toState.name && paramProvider))
		{
			if( toState.name !== fromState.name )
				this.slugOffer = null;

			paramOffer = null;
			paramCategory = 'providers';

			if( !paramProvider )
				console.error( "content.toState requires provider parameter to be set" );
		}

		//if( paramProvider === 'all' )
		//	paramCategory = 'providers';

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
		//console.log("fetchContent", slugCategory, slugProvider, slugOffer, force );
		//console.log( "           ", this.slugCategory, this.slugProvider, this.slugOffer );

		//
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

		let catTreePromise = this.fetchCategoryTree( config, force );

		catTreePromise.then( () =>
		{
			let categoryPromise = this.fetchCategory( slugCategory, config, force );

			categoryPromise.then( () =>
			{
				let providerPromise = this.fetchProvider( slugProvider, config, force );
				let offerPromise = this.fetchOffer( slugOffer, config, force );

				this.$q.all( [providerPromise, offerPromise] )
					.then( () =>
						{
							//console.log( "fetchContent complete" );

							this.defer = null;

							this.$rootScope.isLoading = false;
							this.$rootScope.$broadcast( 'contentChanged', this );

							this._setDocumentTitle();
						},
						( msg ) =>
						{
							//console.log( "fetch content canceled/error", msg );
						} );
			} );
		});
	}

	_setDocumentTitle()
	{
		if( this.offer && this.slugOffer )
		{
			document.title = "newhere : " + this.offer.title;
		}
		else if( this.provider && this.slugProvider )
		{
			document.title = "newhere : " + this.provider.organisation;
		}
		else if( this.category && this.slugCategory )
		{
			document.title = "newhere : " + this.category.title;
		}
		else if( this.providerList && !this.slugProvider && !this.slugOffer )
		{
			this.$translate( "Anbieter" ).then( ( msg ) =>
			{
				document.title = "newhere : " + msg;
			} );
		}
		else
		{
			document.title = "newhere : welcome";
		}
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //
	// CATEGORY

	//
	fetchCategoryTree( config, force )
	{
		if( this.categoryTree || true )
			return this.$q.when();

		//
		return this.API.one( "categories", "all" ).withHttpConfig( config ).get()
			.then( ( response ) =>
				{
					//console.log( "fetchCategory TREE complete", response );

					if( !response.length )
						return;

					//
					this.categoryTree = response[0];
					this._setupCategoryTree( this.categoryTree, null );

					//console.log("tree done man: ", this.categoryTree );
				},
				( msg ) =>
				{
					//console.log( "fetch categories canceled/error", msg );
				} );
	}

	//
	_setupCategoryTree( node, parent )
	{
		node.parent = parent;

		//
		angular.forEach( node.all_children, ( child, key ) =>
		{
			this._setupCategoryTree( child, node );
		} );

		//
		node.getNumTotalOffers = function()
		{
			let numTotal = this.offers_count;

			angular.forEach( this.all_children, ( child, key ) =>
			{
				numTotal += child.getNumTotalOffers();
			} );

			return numTotal;
		}
	}

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
		//console.log( "fetchCategory", slugCategory, force );

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
		let slug = this.slugCategory.split(",").pop();

		//
		return this.API.one( "categories", slug ).withHttpConfig( config ).get( query )
			.then( ( response ) =>
				{
					//console.log( "fetchCategory complete", response );

					if( !response.length )
						return;

					//
					this.category = response[0];
					this.categoryList = this.category.children;
					this.offerList = this.category.offers;
					this.markerList = this.category.offers;

					//
					angular.forEach( this.categoryList, ( child, key ) =>
					{
						child.parent = this.category;
					} );

					//
					let providers = [];

					angular.forEach( this.category.offers, ( child, key ) =>
					{
						if( child.ngo )
							providers.push( child.ngo );
					} );

					this._cleanProviders( providers );

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
		//console.log( "fetchProvider", slugProvider, force );

		if( !slugProvider )
		{
			this.provider = null;
			return this.$q.when();
		}

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
					//console.log("fetchProviderList complete", response );

					if( !response.length )
						return;

					//
					this.providerList = response;
					this.provider = null;

					this._cleanProviders(this.providerList);
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
					//console.log("fetchProviderDetail complete", response );

					this.provider = response;
					this.offerList = this.provider.offers;
					this.markerList = this.provider.offers;

					angular.forEach( this.offerList, ( child, key ) =>
					{
						if( !child.ngo )
							child.ngo = this.provider;
					} );

					this._cleanProviders([this.provider]);
				},
				( msg ) =>
				{
					//console.log( "fetch provider.detail canceled/error", msg );
				} );
	}

	_cleanProviders( list )
	{
		//
		angular.forEach( list, ( p, key ) =>
		{
			if( p.organisation )
			{
				let split = p.organisation.split("");

				while( split[split.length -1] === '*' )
					split.pop();

				p.organisation = split.join('');
			}
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
		//console.log( "fetchOffer", slugOffer, force );

		//
		if( !slugOffer )
		{
			this.offer = null;
			return this.$q.when();
		}

		if( !force && slugOffer === this.slugOffer )
			return this.$q.when();

		this.slugOffer = slugOffer;

		// ---------- //

		//
		return this.API.one( "offers", this.slugOffer ).withHttpConfig( config ).get()
			.then( ( response ) =>
				{
					//console.log("fetchOffer complete", response );

					this.offer = response;

					if( this.offer && this.offer.ngo )
						this._cleanProviders([this.offer.ngo]);
				},
				( msg ) =>
				{
					//console.log( "fetch offer canceled/error", msg );
				} );
	}


}
