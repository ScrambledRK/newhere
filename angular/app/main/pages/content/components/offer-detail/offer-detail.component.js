class OfferDetailController
{
	/**
	 *
	 * @param {ContentService} ContentService
	 * @param {RoutingService} RoutingService
	 * @param {MapService} MapService
	 * @param $element
	 * @param $rootScope
	 * @param $scope
	 * @param $state
	 */
	constructor( ContentService,
	             RoutingService,
	             MapService,
	             $element,
	             $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		//
		this.ContentService = ContentService;
		this.RoutingService = RoutingService;
		this.MapService = MapService;

		this.$window = $element;
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$state = $state;
	}

	//
	$onInit()
	{
		this.setContent( null );

		// ------------- //

		let onContentChanged = this.$rootScope.$on( "contentChanged", ( event ) =>
		{
			this.setContent( this.ContentService.offer );
		} );

		this.$scope.$on( '$destroy', () =>
		{
			onContentChanged();
		} );
	}

	//
	setContent( offer )
	{
		this.offer = offer;

		if( this.offer )
		{
			this.MapService.highlightMarker( this.offer );
			this.MapService.zoomTo( this.offer );
		}
	}

	//
	toggleMap()
	{
		this.$rootScope.showMap = !this.$rootScope.showMap;
		this.$rootScope.showDetails = !this.$rootScope.showDetails;
	}

	//
	goProvider()
	{
		this.RoutingService.goProvider( this.offer.ngo.id );
	}

	//
	getURL()
	{
		return this.RoutingService.getProviderURL( this.offer.ngo.id );
	}

	// ----------------- //
	// ----------------- //

	onSwipeUp()
	{
		console.log( "swipe-up" );
	}

	onSwipeDown()
	{
		console.log( "swipe-down" );
	}
}

//
export const OfferDetailComponent = {
	template: require('./offer-detail.component.html'),
	controller: OfferDetailController,
	controllerAs: 'vm',
	bindings: {}
};