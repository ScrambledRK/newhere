export class ContentService
{
	/**
	 *
	 * @param {Restangular} API
	 * @param {LanguageService} LanguageService
	 * @param {*} $state
	 * @param {*} $translate
	 * @param {*} $rootScope
	 * @param {*} $q
	 */
	constructor( API,
	             LanguageService,
	             $state,
	             $translate,
	             $rootScope,
	             $q )
	{
		'ngInject';

		//
		this.API = API;
		this.LanguageService = LanguageService;

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
			this.onStateChanged( toParams );
		} );

		// --------------------------- //

		//
		this.offer = {};

		this.category = {
			children: [],
			offers: []
		};

		//
		this.slugCategory = null;
		this.slugOffer = null;
		this.defer = null;

		console.log( $state );

		//
		this.fetchContent(
			this.$state.params.category,
			this.$state.params.offer,
			false
		);
	}

	/**
	 *
	 */
	onLanguageChanged()
	{
		this.fetchContent( this.slugCategory, this.slugOffer, true );
	}

	/**
	 *
	 * @param toParams
	 */
	onStateChanged( toParams )
	{
		this.fetchContent( toParams.category, toParams.offer, false );
	}

	/**
	 *
	 * @param {string} slugCategory
	 * @param {string} slugOffer
	 * @param {boolean} force
	 */
	fetchContent( slugCategory, slugOffer, force )
	{
		if( this.defer !== null )
			this.defer.resolve();

		//
		this.defer = this.$q.defer();

		let config = {
			timeout: this.defer.promise
		};

		// ------------- //

		let categoryPromise = this.fetchCategories( slugCategory, config, force );
		let offerPromise = this.fetchOffer( slugOffer, config, force );

		this.$q.all( [categoryPromise, offerPromise] ).then( () =>
		{
			this.defer = null;
			this.$rootScope.$broadcast( 'contentChanged', this.category, this.offer );
		} );
	}

	/**
	 *
	 * @param {string} slugCategory
	 * @param {*} config
	 * @param {boolean} force
	 *
	 * @return {promise}
	 */
	fetchCategories( slugCategory, config, force )
	{
		console.log("fetching categories: ", slugCategory );

		if( !slugCategory || slugCategory === '' )
			slugCategory = 'start';

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

				//
				for( let j = 1; j < response.length; j++ )
				{
					if( response[j].children )
						this.category.children.push.apply( this.category.children, response[j].children );
				}
			} );
	}

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
		console.log("fetching offer: ", slugOffer );

		if( !slugOffer || slugOffer === '' )
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
			} );
	}

}
