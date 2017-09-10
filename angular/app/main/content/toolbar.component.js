class ToolbarController
{
	/**
	 *
	 * @param {ContentService} ContentService
	 * @param $rootScope
	 * @param $scope
	 * @param $state
	 */
	constructor( ContentService,
	             $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		//
		this.ContentService = ContentService;

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
	changeCategory( category )
	{
		this.$state.go('main.content', {slug:category.slug}, {reload:false} );
	}

}

/**
 *
 * @type {{templateUrl: string, controller: ToolbarController, controllerAs: string, bindings: {hideFilterBtn: string}}}
 */
export const ToolbarComponent = {
	templateUrl: './views/app/main/content/toolbar.component.html',
	controller: ToolbarController,
	controllerAs: 'vm',
	bindings: {}
}