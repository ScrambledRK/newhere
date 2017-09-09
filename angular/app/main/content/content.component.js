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
		this.categories = this.ContentService.category.children;

		this.MapService.markers = {};
		this.$rootScope.showMap = false;

		// ------------- //

		let onCategoryChanged = this.$rootScope.$on( "contentChanged", ( event, category ) =>
		{
			this.categories = category.children;
		} );

		this.$scope.$on('$destroy', () =>
		{
			onCategoryChanged();
		});
	}

	/**
	 *
	 * @param category
	 */
	changeCategory( category )
	{
		this.$state.go('main.content', {slug:category}, {reload:true} );
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