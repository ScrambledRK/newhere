class LocatorController
{
	/**
	 *
	 * @param {MapService} MapService
	 * @param {SearchService} SearchService
	 * @param {RoutingService} RoutingService
	 * @param {LanguageService} LanguageService
	 * @param {*} $rootScope
	 */
	constructor( MapService,
	             SearchService,
	             RoutingService,
	             LanguageService,
	             $rootScope )
	{
		'ngInject';

		this.MapService = MapService;
		this.SearchService = SearchService;
		this.RoutingService = RoutingService;
		this.LanguageService = LanguageService;
		this.$rootScope = $rootScope;
	}

	/**
	 * get/show position of user via gps
	 */
	locateMe()
	{
		this.MapService.locate();
	}

	/**
	 *
	 * @param search
	 * @returns {*}
	 */
	search( search )
	{
		if( !search )
			return [];

		//
		return this.SearchService.searchOffers( search ).then( (response) =>
		{
			return response;
		} );
	}

	/**
	 *
	 * @param item
	 */
	onItemSelect( item )
	{
		console.log("locator.item.select",item);

		if( item )
			this.RoutingService.goContent( '', item.id )
	}
}

//
export const LocatorComponent = {
	template: require('./locator.component.html'),
	controller: LocatorController,
	controllerAs: 'vm',
	bindings: {}
};
