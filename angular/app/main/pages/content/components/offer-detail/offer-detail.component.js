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
	             $window,
	             $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		//
		this.ContentService = ContentService;
		this.RoutingService = RoutingService;
		this.MapService = MapService;

		this.$window = $window;
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

		//
		if( this.offer && this.offer.street )
		{
			let address = this.offer.street + " " + this.offer.streetnumber;

			//
			this.link_google = "https://www.google.com/maps/dir/?api=1&destination=";
			this.link_google += this.$window.encodeURIComponent( address );

			this.link_wlinien = "https://www.wienerlinien.at/eportal3/ep/channelView.do/channelId/-46649"
			this.link_wlinien += "?routeTo=" + address;
		}
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
		this.RoutingService.setMapFocus( false );
	}

	onSwipeDown()
	{
		this.RoutingService.setMapFocus( true );
	}

}

//
export const OfferDetailComponent = {
	template: require('./offer-detail.component.html'),
	controller: OfferDetailController,
	controllerAs: 'vm',
	bindings: {}
};