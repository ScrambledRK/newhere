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

		this.$scope.$on( '$destroy', () =>
		{
			onCategoryChanged();
		} );
	}

	//
	setContent()
	{
		let category = this.ContentService.category;

		this.categories = [];

		while( category && this.categories.length < 3 )
		{
			if( this.$rootScope.isTextAlignmentLeft )
			{
				this.categories.unshift( category );
			}
			else
			{
				this.categories.push( category );
			}

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

//
export const ToolbarComponent = {
	template: require( './toolbar.component.html' ),
	controller: ToolbarController,
	controllerAs: 'vm',
	bindings: {}
};