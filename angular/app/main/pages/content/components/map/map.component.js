class MapController
{
	/**
	 *
	 * @param {MapService} MapService
	 * @param {ContentService} ContentService
	 * @param {RoutingService} RoutingService
	 * @param {*} $scope
	 * @param {*} $state
	 */
	constructor( MapService,
	             ContentService,
	             RoutingService,
	             $scope,
	             $state )
	{
		'ngInject';

		let vm = this;

		this.MapService = MapService;
		this.ContentService = ContentService;
		this.RoutingService = RoutingService;
		this.$state = $state;

		//
		this.orgLatLng = {};

		//
		$scope.$on( "leafletDirectiveMarker.nhMap.click", function( event, args )
		{
			vm.goOffer( args.model );
		} );

		//
		$scope.$on( 'leafletDirectiveMarker.nhMap.dragstart', function( e, args )
		{
			vm.orgLatLng = args.leafletObject._latlng;
		} );

		//
		$scope.$on( 'leafletDirectiveMarker.nhMap.dragend', function( e, args )
		{
			args.leafletObject.setLatLng( vm.orgLatLng );
			vm.goOffer( args.model );
		} );

	}

	//
	getCurrentCategory()
	{
		return this.ContentService.category;
	}

	/**
	 * @param offer
	 */
	goOffer( offer )
	{
		this.RoutingService.goContent( this.getCurrentCategory().slug, offer.offer_id );
	}
}

//
export const MapComponent = {

	template: require( './map.component.html' ),
	controller: MapController,
	controllerAs: 'vm',
	bindings: {}
}