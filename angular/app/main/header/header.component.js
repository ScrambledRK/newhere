/**
 *
 */
class HeaderController
{
	/**
	 *
	 * @param {RoutingService} RoutingService
	 * @param {*} $mdSidenav
	 * @param {*} $state
	 * @param {*} $scope
	 */
	constructor( RoutingService,
	             $mdSidenav,
	             $state,
	             $scope )
	{
		'ngInject';

		let vm = this;

		this.RoutingService = RoutingService;
		this.$mdSidenav = $mdSidenav;
		this.$state = $state;

		$scope.currState = $state;
		$scope.$watch( 'currState.current.name', function( stateName, oldStateName )
		{
			vm.showNgoLink = stateName.indexOf( 'main.landing' ) > -1;
			vm.showLocator = stateName.indexOf( 'content' ) > -1;
		} );
	}

	//
	$onInit()
	{
	}

	//
	openSideMenu()
	{
		this.$mdSidenav( 'side-menu' ).open();
		//this.$mdSidenav( 'filter' ).close();
	}

	//
	goContent()
	{
		this.RoutingService.goContent( null, null );
	}

	//
	getURL()
	{
		return this.RoutingService.getContentURL( null, null );
	}

}

/**
 *
 * @type {{templateUrl: string, controller: HeaderController, controllerAs: string, bindings: {}}}
 */
export const HeaderComponent = {
	templateUrl: './views/app/main/header/header.component.html',
	controller: HeaderController,
	controllerAs: 'vm',
	bindings: {}
}
