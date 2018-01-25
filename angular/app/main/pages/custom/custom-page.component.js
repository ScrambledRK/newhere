class CustomPageController
{
	/**
	 *
	 * @param {API} API
	 * @param {PageService} PageService
	 * @param {ToastService} ToastService
	 * @param {*} $rootScope
	 * @param {*} $scope
	 * @param {*} $state
	 */
	constructor( API,
				 PageService,
	             ToastService,
	             $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		//
		this.API = API;
		this.PageService = PageService;
		this.ToastService = ToastService;
		this.$rootScope = $rootScope;
		this.$scope = $scope;

		//
		if( $state.params.slug )
			this.fetchItem( $state.params.slug );
	}


	//
	fetchItem( slug )
	{
		this._isLoading = true;

		//
		this.API.one( 'pages', slug ).get()
			.then( ( item ) =>
				{
					this.setPage( item );
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
		//console.log("custom page jo: ", page );
		this.page = page;
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