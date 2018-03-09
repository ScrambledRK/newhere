class CustomPageController
{
	/**
	 *
	 * @param {API} API
	 * @param {PageService} PageService
	 * @param {ToastService} ToastService
	 * @param {LanguageService} LanguageService
	 * @param {*} $rootScope
	 * @param {*} $scope
	 * @param {*} $state
	 */
	constructor( API,
				 PageService,
	             ToastService,
	             LanguageService,
	             $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		//
		this.API = API;
		this.PageService = PageService;
		this.ToastService = ToastService;
		this.LanguageService = LanguageService;
		this.$rootScope = $rootScope;
		this.$scope = $scope;

		//
		if( $state.params.slug )
			this.fetchItem( $state.params.slug );

		// ------------------------------- //

		//
		let onLanguage = this.$rootScope.$on( "languageChanged", ( event, data ) =>
		{
			if( this._slug )
				this.fetchItem( this._slug );
		} );

		this.$scope.$on( '$destroy', () =>
		{
			this.LanguageService.overrideLanguages( null );
			onLanguage();
		} );
	}


	//
	fetchItem( slug )
	{
		this._isLoading = true;
		this._slug = slug;

		//
		this.API.one( 'pages', slug ).get()
			.then( ( item ) =>
				{
					this.setPage( item.data.page );
					this.LanguageService.overrideLanguages( item.data.translations );

					this._isLoading = false;
				},
				( error ) =>
				{
					this.ToastService.error( "Unbekannter Fehler aufgetreten." );
					this._isLoading = false;
				}
			);
	}

	//
	setPage( page )
	{
		this.page = page;

		if( this.page )
			document.title = "newhere : " + this.page.title;
	}


	//
	isLoading()
	{
		return this.$rootScope.isLoading || this._isLoading;
	}
}

//
export const CustomPageComponent = {
	template: require( './custom-page.component.html' ),
	controller: CustomPageController,
	controllerAs: 'vm',
	bindings: {}
};