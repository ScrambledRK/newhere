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
		this.setContent( this.ContentService.offerList );

		// ------------- //

		let onContentChanged = this.$rootScope.$on( "contentChanged", ( event ) =>
		{
			this.setContent( this.ContentService.offerList );
		} );

		this.$scope.$on('$destroy', () =>
		{
			onContentChanged();
		});
	}

	//
	setContent( offers )
	{
		this.offers = offers;

		// this.MapService.markers = {};
		// this.MapService.setMarkers( this.offers );
	}

	//
	goOffer( offer )
	{
		this.RoutingService.goContent( this.ContentService.category.slug, offer.id );
	}

	//
	getURL( offer )
	{
		return this.RoutingService.getContentURL( this.ContentService.category.slug, offer.id );
	}
}

//
export const OfferListComponent = {
	template: require('./offer-list.component.html'),
	controller: OfferListController,
	controllerAs: 'vm',
	bindings: {}
};