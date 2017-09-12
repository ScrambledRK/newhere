class OfferListController
{
	/**
	 *
	 * @param {ContentService} ContentService
	 * @param {RoutingService} RoutingService
	 * @param {MapService} MapService
	 * @param $rootScope
	 * @param $scope
	 * @param $state
	 */
	constructor( ContentService,
	             RoutingService,
	             MapService,
	             $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		//
		this.ContentService = ContentService;
		this.RoutingService = RoutingService;
		this.MapService = MapService;

		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$state = $state;
	}

	//
	$onInit()
	{
		this.setContent( this.getCurrentCategory() );

		// ------------- //

		let onContentChanged = this.$rootScope.$on( "contentChanged", ( event, category, offer ) =>
		{
			this.setContent( category );
		} );

		this.$scope.$on('$destroy', () =>
		{
			onContentChanged();
		});
	}

	//
	getCurrentCategory()
	{
		return this.ContentService.category;
	}

	/**
	 * @param category
	 */
	setContent( category )
	{
		this.offers = category.offers;

		this.MapService.markers = {};
		this.MapService.setMarkers( this.offers );
	}

	/**
	 * @param offer
	 */
	goOffer( offer )
	{
		this.RoutingService.goContent( this.getCurrentCategory().slug, offer.id );
	}
}

/**
 *
 * @type {{templateUrl: string, controller: OfferListController, controllerAs: string, bindings: {}}}
 */
export const OfferListComponent = {
	templateUrl: './views/app/main/content/offers/offer-list.component.html',
	controller: OfferListController,
	controllerAs: 'vm',
	bindings: {}
};