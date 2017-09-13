class ToolbarController
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
		this.setContent();

		// ------------- //

		let onCategoryChanged = this.$rootScope.$on( "contentChanged", ( event ) =>
		{
			this.setContent();
		} );

		this.$scope.$on('$destroy', () =>
		{
			onCategoryChanged();
		});
	}

	//
	setContent( )
	{
		let category = this.ContentService.category;

		this.categories = [];

		while( category && this.categories.length < 3 )
		{
			this.categories.unshift( category );
			category = category.parent;
		}
	}

	//
	goCategory( category )
	{
		this.RoutingService.goContent( category.slug, null );
	}

	//
	getURL( category )
	{
		return this.RoutingService.getContentURL( category.slug, null );
	}
}

/**
 *
 * @type {{templateUrl: string, controller: ToolbarController, controllerAs: string, bindings: {}}}
 */
export const ToolbarComponent = {
	templateUrl: './views/app/main/content/toolbar/toolbar.component.html',
	controller: ToolbarController,
	controllerAs: 'vm',
	bindings: {}
};