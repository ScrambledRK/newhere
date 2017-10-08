class ContentDetailPageController
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
		let hasOffer = Boolean(this.ContentService.offer);

		return this.$rootScope.isLoading && !hasOffer;
	}
}

//
export const ContentDetailPageComponent = {

	template: require( './content-detail-page.html' ),
	controller: ContentDetailPageController,
	controllerAs: 'vm',
	bindings: {}
};