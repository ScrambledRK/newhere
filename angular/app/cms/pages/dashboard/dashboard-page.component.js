class DashboardPageController
{
	constructor( $state, $scope, $rootScope, UserService )
	{
		'ngInject';

		//
		this.$state = $state;
		this.$state = $state;
		this.UserService = UserService;

		//
		this.tab = 0;

		let onUser = $rootScope.$on( "userChanged", ( event, item ) =>
		{
			this._checkUser();
		} );

		$scope.$on( '$destroy', () =>
		{
			onUser();
		} );
	}

	_checkUser()
	{
		console.log("onInit","dashboard-page");

		if( !this.UserService.isAdministrator() )
			this.tab = 1;

		if( this.$state.params.tab )
			this.tab = $state.params.tab;
	}

	//
	isElementVisible( name )
	{
		if( name === "provider" )
			return this.UserService.isAdministrator();

		//
		return false;
	}
}

export const DashboardPageComponent = {
	template: require('./dashboard-page.component.html'),
	controller: DashboardPageController,
	controllerAs: 'vm',
	bindings: {}
};