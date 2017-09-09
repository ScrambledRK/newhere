/**
 *
 */
class HeaderController
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
	gotoStart()
	{
		this.$state.go('main.content', {slug:'start'} );
	}

	//
	gotoNgoLanding()
	{
		this.$state.go('main.content');
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
