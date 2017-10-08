class ProviderListPageController
{
	/**
	 * @param {ContentService} ContentService
	 * @param {*} $rootScope
	 */
	constructor( ContentService,
	             $rootScope )
	{
		'ngInject';

		//
		this.ContentService = ContentService;
		this.$rootScope = $rootScope;
	}

	//
	isLoading()
	{
		let providerList = this.ContentService.providerList;
		let hasProviders = Boolean(providerList && providerList.length > 0);

		return this.$rootScope.isLoading && !hasProviders;
	}
}

//
export const ProviderListPageComponent = {

	template: require( './provider-list-page.html' ),
	controller: ProviderListPageController,
	controllerAs: 'vm',
	bindings: {}
};