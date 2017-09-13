class ProviderListController
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
		this.setContent( this.ContentService.providerList );

		// ------------- //

		let onContentChanged = this.$rootScope.$on( "contentChanged", ( event ) =>
		{
			this.setContent( this.ContentService.providerList );
		} );

		this.$scope.$on('$destroy', () =>
		{
			onContentChanged();
		});
	}

	//
	setContent( providerList )
	{
		this.providers = providerList;
	}

	//
	goProvider( provider )
	{
		this.RoutingService.goProvider( provider.id );
	}

	//
	getURL( provider )
	{
		return this.RoutingService.getProviderURL( provider.id );
	}

	//
	isLoading()
	{
		let hasProviders = this.providers && this.providers.length > 0;
		return this.$rootScope.isLoading && !hasProviders;
	}
}

/**
 *
 * @type {{templateUrl: string, controller: ProviderListController, controllerAs: string, bindings: {}}}
 */
export const ProviderListComponent = {
	templateUrl: './views/app/main/content/providers/provider-list.component.html',
	controller: ProviderListController,
	controllerAs: 'vm',
	bindings: {}
};