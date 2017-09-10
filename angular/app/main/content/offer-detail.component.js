class OfferDetailController
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
	             MapService,
	             $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		//
		this.ContentService = ContentService;
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

		let onContentChanged = this.$rootScope.$on( "contentChanged", ( event, category, offer ) =>
		{
			this.setContent( offer );
		} );

		this.$scope.$on('$destroy', () =>
		{
			onContentChanged();
		});
	}

	/**
	 * @param offer
	 */
	setContent( offer )
	{
		this.offer = offer;

		if( this.offer )
		{
			this.$rootScope.isSplit = true;
			this.$rootScope.showMap = true;
			this.$rootScope.showDetails = false;

			this.MapService.highlightMarker( this.offer );
			this.MapService.zoomTo( this.offer );
		}
		else
		{

		}
	}

	toggleMap()
	{
		this.$rootScope.showMap = !this.$rootScope.showMap;
		this.$rootScope.showDetails = !this.$rootScope.showDetails;
	}
}

export const OfferDetailComponent = {
	templateUrl: './views/app/main/content/offer-detail.component.html',
	controller: OfferDetailController,
	controllerAs: 'vm',
	bindings: {}
};