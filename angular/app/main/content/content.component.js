class ContentController
{
	/**
	 *
	 * @param {ContentService} ContentService
	 * @param {MapService} MapService
	 * @param $rootScope
	 */
	constructor( ContentService,
	             MapService,
	             $rootScope )
	{
		'ngInject';

		//
		this.categories = null;

		//
		this.ContentService = ContentService;
		this.MapService = MapService;
		this.MapService.markers = {};

		$rootScope.showMap = false;
	}

	$onInit()
	{
		this.categories = this.ContentService.all();
	}

	//
	changeCategory( category )
	{
		console.log( "changeCategory", category );  // ui-sref="app.start.categories.sub({slug: category.slug})"
	}
}

/**
 *
 * @type {{templateUrl: string, controller: ContentController, controllerAs: string, bindings: {}}}
 */
export const ContentComponent = {
	templateUrl: './views/app/main/content/content.component.html',
	controller: ContentController,
	controllerAs: 'vm',
	bindings: {}
};