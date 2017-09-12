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
		this.categories = [];

		while( category && this.categories.length < 3 )
		{
			this.categories.unshift( category );
			category = category.parent;
		}
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
 * @type {{templateUrl: string, controller: ToolbarController, controllerAs: string, bindings: {hideFilterBtn: string}}}
 */
export const ToolbarComponent = {
	templateUrl: './views/app/main/content/toolbar/toolbar.component.html',
	controller: ToolbarController,
	controllerAs: 'vm',
	bindings: {}
}