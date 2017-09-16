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

	//
	isLoading()
	{
		let offerList = this.ContentService.offerList;

		let hasProvider = Boolean(this.ContentService.provider);
		let hasOffers = Boolean(offerList && offerList.length > 0);

		return this.$rootScope.isLoading && !hasProvider && !hasOffers;
	}
}

//
export const ProviderDetailPageComponent = {

	template: require( './provider-detail-page.html' ),
	controller: ProviderDetailPageController,
	controllerAs: 'vm',
	bindings: {}
};