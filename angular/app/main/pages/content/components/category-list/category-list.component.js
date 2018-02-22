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
		this.setContent( this.ContentService.categoryList );

		// ------------- //

		let onContentChanged = this.$rootScope.$on( "contentChanged", ( event ) =>
		{
			this.setContent( this.ContentService.categoryList );
		} );

		this.$scope.$on( '$destroy', () =>
		{
			onContentChanged();
		} );
	}

	//
	setContent( categoryList )
	{
		this.categories = categoryList;
	}

	//
	goCategory( category )
	{
		if( category.slug === 'providers')
		{
			this.RoutingService.goProvider( 'all' );
		}
		else
		{
			this.RoutingService.goContent( category.slug, null );
		}
	}

	//
	getURL( category )
	{
		if( category.slug === 'providers')
		{
			return this.RoutingService.getProviderURL( 'all' );
		}
		else
		{
			return this.RoutingService.getContentURL( category.slug, null );
		}
	}

	//
	isLoading()
	{
		let offerList = this.ContentService.offerList;

		let hasCategories = this.categories && this.categories.length > 0;
		let hasOffers = offerList && offerList.length > 0;

		return this.$rootScope.isLoading && !hasCategories && !hasOffers;
	}
}

//
export const CategoryListComponent = {
	template: require( './category-list.component.html' ),
	controller: CategoryListController,
	controllerAs: 'vm',
	bindings: {}
};