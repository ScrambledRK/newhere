class ContentListPageController
{
	/**
	 * @param {ContentService} ContentService
	 * @param {*} $rootScope
	 */
	constructor( ContentService,
	             $rootScope,
	             $state )
	{
		'ngInject';

		//
		this.ContentService = ContentService;
		this.$rootScope = $rootScope;
		this.$state = $state;
	}

	hasOffers()
	{
		let offerList = this.ContentService.offerList;
		return Boolean(offerList && offerList.length > 0);
	}

	hasCategories()
	{
		let categoryList = this.ContentService.categoryList;
		return Boolean(categoryList && categoryList.length > 0);
	}

	//
	isLoading()
	{
		return this.$rootScope.isLoading && !this.hasCategories() && !this.hasOffers();
	}

	// ------------------------- //

	goFurther()
	{
		this.$state.go( 'main.page', {slug:this.ContentService.category.page.slug} );
	}

	//
	getFurtherURL()
	{
		return "#!/page/" + this.ContentService.category.page.slug;
	}
}

//
export const ContentListPageComponent = {

	template: require( './content-list-page.html' ),
	controller: ContentListPageController,
	controllerAs: 'vm',
	bindings: {}
};