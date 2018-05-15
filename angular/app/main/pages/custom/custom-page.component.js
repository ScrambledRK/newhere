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
	             DocumentService,
	             $timeout,
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
		this.DocumentService = DocumentService;
		this.$timeout = $timeout;
		this.$rootScope = $rootScope;
		this.$scope = $scope;

		//
		if( $state.params.slug )
			this.fetchItem( $state.params.slug );

		// ------------------------------- //

		//
		let onLanguage = this.$rootScope.$on( "languageChanged", ( event, language ) =>
		{
			if( this._slug )
				this.fetchItem( this._slug );
		} );

		let onContentLanguage = this.$rootScope.$on( "contentLanguageChanged", ( event, language ) =>
		{
			if( this._slug )
				this.fetchItem( this._slug, language );
		} );


		this.$scope.$on( '$destroy', () =>
		{
			this.LanguageService.overrideLanguages( null );

			onContentLanguage();
			onLanguage();
		} );
	}


	//
	fetchItem( slug, language )
	{
		this._isLoading = true;
		this._slug = slug;

		if( !language )
			language = this.$rootScope.language;

		//
		this.API.one( 'pages', slug ).get( {language:language} )
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
			this.DocumentService.changeTitle( this.page.title );

		this.$timeout( () => { this.parsePage(); }, 0, false );
	}

	parsePage()
	{
		let barList = document.getElementsByClassName("toggle-bar");
		let boxList = document.getElementsByClassName("toggle-box");

		//
		angular.forEach( barList, ( item, index ) =>
		{
			let box = angular.element( boxList[index] );

			let bar = angular.element( item );
				bar.on( "click", () =>
				{
					if( box.hasClass("active") )
					{
						box.removeClass("active");
						bar.removeClass("active");
					}
					else
					{
						box.addClass("active");
						bar.addClass("active");
					}
				});
		} );
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