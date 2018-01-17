class ProviderDetailPageController
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

	hasOffers()
	{
		let offerList = this.ContentService.offerList;
		return Boolean(offerList && offerList.length > 0);
	}

	//
	isLoading()
	{
		let hasProvider = Boolean(this.ContentService.provider);
		return this.$rootScope.isLoading && !hasProvider && !this.hasOffers();
	}
}

//
export const ProviderDetailPageComponent = {

	template: require( './provider-detail-page.html' ),
	controller: ProviderDetailPageController,
	controllerAs: 'vm',
	bindings: {}
};