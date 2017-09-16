class ContentListPageController
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
		let categoryList = this.ContentService.categoryList;

		let hasCategories = Boolean(categoryList && categoryList.length > 0);
		let hasOffers = Boolean(offerList && offerList.length > 0);

		return this.$rootScope.isLoading && !hasCategories && !hasOffers;
	}
}

//
export const ContentListPageComponent = {

	template: require( './content-list-page.html' ),
	controller: ContentListPageController,
	controllerAs: 'vm',
	bindings: {}
};