class MapController
{
	/**
	 *
	 * @param {MapService} MapService
	 * @param {*} $scope
	 * @param {*} $state
	 */
	constructor( MapService,
	             $scope,
	             $state )
	{
		'ngInject';

		var vm = this;

		this.MapService = MapService;
		this.$state = $state;
		this.orgLatLng = {};

		//
		$scope.$on( "leafletDirectiveMarker.nhMap.click", function( event, args )
		{
			vm.$state.go( 'app.start.detail', {
				id: args.model.offer_id
			} );
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
			vm.$state.go( 'app.start.detail', {
				id: args.model.offer_id
			} );
		} );
	}

}

/**
 *
 * @type {{templateUrl: string, controller: MapController, controllerAs: string, bindings: {}}}
 */
export const MapComponent = {
	templateUrl: './views/app/map/map.component.html',
	controller: MapController,
	controllerAs: 'vm',
	bindings: {}
}