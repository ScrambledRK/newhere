export class ContentService
{
	/**
	 *
	 * @param {*} API
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
		this.categories = [];

		//
		this.API = API;
		this.LanguageService = LanguageService;

		this.$state = $state;
		this.$translate = $translate;

		this.$rootScope = $rootScope;
		this.$rootScope.$on( "languageChanged", (event, data) =>
		{
			this.onLanguageChanged(event,data);
		});
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
	 */
	all()
	{
		if( this.categories.length > 0 )
			return this.categories;

		//
		this.API.all('categories').getList()
			.then( (list) =>
			{
				this.categories.push.apply(this.categories, list);  // keep the same array reference
			});

		return this.categories;
	}
}
