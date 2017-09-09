class ContentController
{
	/**
	 *
	 * @param {ContentService} ContentService
	 * @param {MapService} MapService
	 * @param $rootScope
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

		this.$state = $state;
		this.$rootScope = $rootScope;
		this.$scope = $scope;
	}

	//
	$onInit()
	{
		this.MapService.markers = {};
		this.$rootScope.showMap = false;

		this.setContent( this.ContentService.category );

		// ------------- //

		let onCategoryChanged = this.$rootScope.$on( "contentChanged", ( event, category ) =>
		{
			this.setContent( category );
		} );

		this.$scope.$on('$destroy', () =>
		{
			onCategoryChanged();
		});
	}

	/**
	 * @param category
	 */
	setContent( category )
	{
		this.categories = category.children;
		this.offers = category.offers;

		this.MapService.setMarkers( this.offers );
	}

	/**
	 * @param category
	 */
	changeCategory( category )
	{
		this.$state.go('main.content', {slug:category.slug}, {reload:false} );
	}

	/**
	 * @param offer
	 */
	showOffer( offer )
	{
		console.log( offer );
	}
}

/**
 *
 * @type {{templateUrl: string, controller: ContentController, controllerAs: string, bindings: {}}}
 */
export const ContentComponent = {
	templateUrl: './views/app/main/content/content.component.html',
	controller: ContentController,
	controllerAs: 'vm',
	bindings: {}
};