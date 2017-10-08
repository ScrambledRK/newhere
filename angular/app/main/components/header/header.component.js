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

		this.RoutingService = RoutingService;
		this.$mdSidenav = $mdSidenav;
		this.$state = $state;

		$scope.currState = $state;
		$scope.$watch( 'currState.current.name', ( stateName ) =>
		{
			this.showNgoLink = stateName.indexOf( 'main.landing' ) > -1;
			this.showLocator = stateName.indexOf( 'content' ) > -1;
		} );
	}

	//
	openSideMenu()
	{
		this.$mdSidenav( 'side-menu' ).open();
	}

	//
	goContent()
	{
	//	this.RoutingService.goContent( null, null );
		this.$state.go("main.landing");
	}

	//
	getURL()
	{
		return "#!/"; //this.RoutingService.getContentURL( null, null );
	}
}

//
export const HeaderComponent = {
	template: require( "./header.component.html" ),
	controller: HeaderController,
	controllerAs: 'vm',
	bindings: {}
}
