export class ContentService
{
	/**
	 *
	 * @param {Restangular} API
	 * @param {LanguageService} LanguageService
	 * @param {*} $state
	 * @param {*} $translate
	 * @param {*} $rootScope
	 */
	constructor( API,
	             LanguageService,
	             $state,
	             $translate,
	             $rootScope)
	{
		'ngInject';

		//
		this.API = API;
		this.LanguageService = LanguageService;

		this.$state = $state;
		this.$translate = $translate;
		this.$rootScope = $rootScope;

		// --------------------------- //

		//
		this.$rootScope.$on( "languageChanged", (event, data) =>
		{
			this.onLanguageChanged();
		});

		//
		this.$rootScope.$on( "$stateChangeStart", (event, toState, toParams, fromState, fromParams) =>
		{
			this.onStateChanged( toParams );
		});

		// --------------------------- //

		//
		this.categories = [];
		this.queryCategories = null;

		this.slug = this.$state.params.slug;
		this.fetchCategories();
	}

	/**
	 *
	 */
	onLanguageChanged()
	{
		if( this.categories.length === 0 )
			return;

		this.fetchCategories();
	}

	/**
	 *
	 * @param toParams
	 */
	onStateChanged( toParams)
	{
		if( this.slug === toParams.slug )
			return;

		this.slug = toParams.slug;
		this.fetchCategories();
	}

	/**
	 *
	 */
	fetchCategories()
	{
		if( this.queryCategories !== null )
			return;

		//
		this.categories.length = 0;     // keep instance for controllers

		if( this.slug === '' )
			this.slug = 'start';

		//
		let query = {
			withChildren:true,
			withParents:true
		};

		//
		this.queryCategories = this.API.one( "categories", this.slug ).get(query)
			.then( (response) =>
			{
				console.log("!\n",response);

				if(response[0].children)
					this.categories.push.apply(this.categories, response[0].children);

				this.queryCategories = null;
			});
	}
}
