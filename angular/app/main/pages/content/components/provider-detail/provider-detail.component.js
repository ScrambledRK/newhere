class ProviderDetailController
{
	/**
	 *
	 * @param {ContentService} ContentService
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
		this.setContent( null );

		// ------------- //

		let onContentChanged = this.$rootScope.$on( "contentChanged", ( event ) =>
		{
			this.setContent( this.ContentService.provider );
		} );

		this.$scope.$on( '$destroy', () =>
		{
			onContentChanged();
		} );
	}

	/**
	 * @param provider
	 */
	setContent( provider )
	{
		this.provider = provider;

		if( this.ContentService.offerList && this.ContentService.offerList.length )
			this.MapService.zoomTo( this.ContentService.offerList[0] );
	}

	//
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
export const ProviderDetailComponent = {
	template: require( './provider-detail.component.html' ),
	controller: ProviderDetailController,
	controllerAs: 'vm',
	bindings: {}
};