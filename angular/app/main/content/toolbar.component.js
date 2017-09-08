class ToolbarController
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
		this.$mdSidenav( 'side-menu' ).close();
		//this.$mdSidenav( 'filter' ).toggle();
	}

	//
	goBack()
	{
		history.back();
	}
}

/**
 *
 * @type {{templateUrl: string, controller: ToolbarController, controllerAs: string, bindings: {hideFilterBtn: string}}}
 */
export const ToolbarComponent = {
	templateUrl: './views/app/main/content/toolbar.component.html',
	controller: ToolbarController,
	controllerAs: 'vm',
	bindings: {
		hideFilterBtn: '='
	}
}