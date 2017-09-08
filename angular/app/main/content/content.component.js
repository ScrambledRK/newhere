class ContentController
{
	/**
	 *
	 * @param {ContentService} ContentService
	 * @param {MapService} MapService
	 * @param $rootScope
	 * @param $state
	 */
	constructor( ContentService,
	             MapService,
	             $rootScope,
	             $state )
	{
		'ngInject';

		//
		this.categories = null;

		//
		this.$state = $state;

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
		this.$state.go('main.content', {slug:category}, {reload:true} );
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