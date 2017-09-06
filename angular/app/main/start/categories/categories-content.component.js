class AppCategoriesContentController
{
	/**
	 *
	 * @param {CategoryService} CategoryService
	 * @param {MapService} MapService
	 * @param $rootScope
	 */
	constructor( CategoryService,
	             MapService,
	             $rootScope )
	{
		'ngInject';

		//
		this.categories = null;

		//
		this.CategoryService = CategoryService;
		this.MapService = MapService;
		this.MapService.markers = {};

		$rootScope.showMap = false;
	}

	$onInit()
	{
		this.categories = this.CategoryService.all();
	}

	//
	changeCategory( category )
	{
		console.log( "changeCategory", category );  // ui-sref="app.start.categories.sub({slug: category.slug})"
	}
}

/**
 *
 * @type {{templateUrl: string, controller: AppCategoriesContentController, controllerAs: string, bindings: {}}}
 */
export const AppCategoriesContentComponent = {
	templateUrl: './views/app/main/start/categories/categories-content.component.html',
	controller: AppCategoriesContentController,
	controllerAs: 'vm',
	bindings: {}
};