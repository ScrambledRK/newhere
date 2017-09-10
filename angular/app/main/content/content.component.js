class ContentController
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
		this.MapService.markers = {};
		this.$rootScope.showMap = false;

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

	getCurrentCategory()
	{
		return this.ContentService.category;
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
		let params = {
			category:category.slug,
			offer:null
		};

		let config = {
			reload:false,
			inherit:false
		};

		this.$state.go('main.content', params, config );
	}

	/**
	 * @param offer
	 */
	showOffer( offer )
	{
		let params = {
			category:this.getCurrentCategory().slug,
			offer:offer.id
		};

		let config = {
			reload:false,
			inherit:false
		};

		this.$state.go('main.content', params, config );
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