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
		this.category = {
			children:[],
			offers:[]
		};

		this.slug = null;
		this.defer = null;

		this.fetchContent( this.$state.params.slug, false );
	}

	/**
	 *
	 */
	onLanguageChanged()
	{
		this.fetchContent( this.slug, true );
	}

	/**
	 *
	 * @param toParams
	 */
	onStateChanged( toParams )
	{
		this.fetchContent( toParams.slug, false );
	}

	/**
	 *
	 * @param {string} slug
	 * @param {boolean} force
	 */
	fetchContent( slug, force )
	{
		if( slug === '' )
			slug = 'start';

		if( !force && slug === this.slug )
			return;

		this.slug = slug;

		//
		if( this.defer !== null )
			this.defer.resolve();

		// ------------- //

		this.defer = this.$q.defer();

		let config = {
			timeout:this.defer.promise
		};

		//
		let query = {
			withChildren: true,
			withParents: true
		};

		//
		this.API.one( "categories", this.slug ).withHttpConfig( config ).get( query )
			.then( ( response ) =>
			{
				if( !response.length )
					return;

				//
				this.category = response[0];
				this.defer = null;

				//
				for( let j = 1; j < response.length; j++ )
				{
					if( response[j].children )
						this.category.children.push.apply( this.category.children, response[j].children );
				}

				this.$rootScope.$broadcast( 'contentChanged', this.category );
			} );
	}
}
