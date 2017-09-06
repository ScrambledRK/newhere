class AppCategoriesToolbarController
{
	/**
	 *
	 * @param {CategoryService} CategoryService
	 * @param $state
	 * @param $mdSidenav
	 */
	constructor( CategoryService,
	             $state,
	             $mdSidenav)
	{
		'ngInject';

		//
		this.$state = $state;
		this.CategoryService = CategoryService;
		this.$mdSidenav = $mdSidenav;

		this.hideFilter = false;
		if( $state.current.data.hideFilter )
		{
			this.hideFilter = $state.current.data.hideFilter;
		}

		this.category = {};
	}

	//
	$onInit()
	{
	}

	//
	showFilter()
	{
		this.$mdSidenav( 'main-menu' ).close();
		this.$mdSidenav( 'filter' ).toggle();
	}

	//
	goBack()
	{
		history.back();
	}
}

/**
 *
 * @type {{templateUrl: string, controller: AppCategoriesToolbarController, controllerAs: string, bindings: {hideFilterBtn: string}}}
 */
export const AppCategoriesToolbarComponent = {
	templateUrl: './views/app/main/start/categories/categories-toolbar.component.html',
	controller: AppCategoriesToolbarController,
	controllerAs: 'vm',
	bindings: {
		hideFilterBtn: '='
	}
}