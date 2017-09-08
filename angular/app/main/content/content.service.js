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
			this.onLanguageChanged(event,data);
		});

		//
		this.$rootScope.$on( "$stateChangeStart", (event, toState, toParams, fromState, fromParams) =>
		{
			this.onStateChanged(event, toState, toParams, fromState, fromParams);
		});

		// --------------------------- //

		//
		this.categories = [];
		this.slug = this.$state.params.slug;
	}

	/**
	 *
	 * @param event
	 * @param data
	 */
	onLanguageChanged( event, data )
	{
		if( this.categories.length === 0 )
			return;

		this.categories.length = 0;
		this.all();
	}

	/**
	 *
	 * @param event
	 * @param toState
	 * @param toParams
	 * @param fromState
	 * @param fromParams
	 */
	onStateChanged(event, toState, toParams, fromState, fromParams)
	{
		console.log( toState );
		console.log( toParams );
		console.log( fromState );
		console.log( fromParams );

		if( this.slug === toParams.slug )
			return;

		this.slug = toParams.slug;
		this.categories.length = 0;
	}

	/**
	 * TODO: could query twice when called twice without response in between
	 */
	all()
	{
		if( this.categories.length > 0 )
			return this.categories;

		//
		if( this.slug === '' )
		{
			let query = {parent_id:0};

			this.API.all("categories").getList(query)
				.then( (response) =>
				{
					this.categories.push.apply(this.categories, response);
				});
		}
		else
		{
			this.API.one( "categories", this.slug ).one('children').get()
				.then( (response) =>
				{
					console.log(response[0]);

					if(response[0].children)
						this.categories.push.apply(this.categories, response[0].children);
				});
		}

		return this.categories;
	}
}
