class CategoryListController
{
	/**
	 *
	 * @param {ContentService} ContentService
	 * @param {RoutingService} RoutingService
	 * @param $rootScope
	 * @param $scope
	 * @param $state
	 */
	constructor( ContentService,
	             RoutingService,
	             $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		//
		this.ContentService = ContentService;
		this.RoutingService = RoutingService;

		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$state = $state;
	}

	//
	$onInit()
	{
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

	//
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
	}

	/**
	 * @param category
	 */
	goCategory( category )
	{
		this.RoutingService.goContent( category.slug, null );
	}
}

/**
 *
 * @type {{templateUrl: string, controller: CategoryListController, controllerAs: string, bindings: {}}}
 */
export const CategoryListComponent = {
	templateUrl: './views/app/main/content/offers/category-list.component.html',
	controller: CategoryListController,
	controllerAs: 'vm',
	bindings: {}
};