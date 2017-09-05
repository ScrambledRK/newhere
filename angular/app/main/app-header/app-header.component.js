/**
 *
 */
class AppHeaderController
{
	/**
	 *
	 * @param {*} $mdSidenav
	 * @param {*} $state
	 * @param {*} $scope
	 */
	constructor( $mdSidenav,
	             $state,
	             $scope )
	{
		'ngInject';

		let vm = this;

		this.$mdSidenav = $mdSidenav;
		$scope.currState = $state;

		$scope.$watch( 'currState.current.name', function( stateName, oldStateName )
		{
			vm.showNgoLink = stateName.indexOf( 'app.landing' ) > -1;
			vm.showLocator = stateName.indexOf( 'start' ) > -1;
		} );
	}

	//
	$onInit()
	{
	}

	//
	openMainMenu()
	{
		this.$mdSidenav( 'main-menu' ).open();
		this.$mdSidenav( 'filter' ).close();
	}
}

/**
 *
 * @type {{templateUrl: string, controller: AppHeaderController, controllerAs: string, bindings: {}}}
 */
export const AppHeaderComponent = {
	templateUrl: './views/app/main/app-header/app-header.component.html',
	controller: AppHeaderController,
	controllerAs: 'vm',
	bindings: {}
}
