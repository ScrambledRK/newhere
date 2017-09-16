class MapTogglerController
{
	/**
	 * @param {RoutingService} RoutingService
	 */
	constructor( RoutingService,
	             $document )
	{
		'ngInject';

		//
		this.RoutingService = RoutingService;
		this.$document = $document;
	}

	//
	isMapFocused()
	{
		return this.RoutingService.isMapFocused;
	}

	//
	toggleMap()
	{
		this.RoutingService.setMapFocus( !this.isMapFocused() );
	}
}

//
export const MapTogglerWide = {

	template: require( "./map-toggler-wide.component.html" ),
	controller: MapTogglerController,
	controllerAs: 'vm',
	bindings: {}
};

//
export const MapTogglerCircle = {

	template: require( "./map-toggler-circle.component.html" ),
	controller: MapTogglerController,
	controllerAs: 'vm',
	bindings: {}
};