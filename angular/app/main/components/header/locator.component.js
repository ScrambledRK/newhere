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
			let result = [];

			//
			angular.forEach( response.data.r_providers, ( provider, key ) =>
			{
				provider.type = "provider";
				provider.title = provider.organisation;

				result.push( provider );
			} );

			//
			angular.forEach( response.data.r_categories, ( category, key ) =>
			{
				category.type = "category";
				result.push( category );
			} );

			//
			angular.forEach( response.data.r_offers, ( offer, key ) =>
			{
				offer.type = "offer";
				result.push( offer );
			} );

			return result;
		} );
	}

	/**
	 *
	 * @param item
	 */
	onItemSelect( item )
	{
		if( !item )
			return;

		if( item.type === 'offer' )
		{
			let cat = null;

			if( item.categories && item.categories.length > 0 )
				cat = item.categories[0];

			this.RoutingService.goContent( cat, item.id );
		}

		if( item.type === 'category' )
			this.RoutingService.goContent( item, null );

		if( item.type === 'provider' )
			this.RoutingService.goProvider( item.id );
	}
}

//
export const LocatorComponent = {
	template: require('./locator.component.html'),
	controller: LocatorController,
	controllerAs: 'vm',
	bindings: {}
};
