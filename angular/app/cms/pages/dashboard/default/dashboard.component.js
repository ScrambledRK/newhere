class DashboardController
{
	/**
	 */
	constructor( ToastService,
	             ProviderService,
	             UserService,
	             API,
	             $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		this.ToastService = ToastService;
		this.ProviderService = ProviderService;
		this.UserService = UserService;
		this.API = API;

		this.$rootScope = $rootScope;
		this.$scope = $scope;

		// ------------ //

		this.pendings = [];
	}

	// --------------------------------------- //
	// --------------------------------------- //

	//
	isElementVisible( name )
	{
		if( name === "pending-requests" )
			return this.UserService.isAdministrator();

		if( name === "user" )
			return true; //this.UserService.isAdministrator();

		if( name === "accept" )
			return false; //this.UserService.isAdministrator();

		//
		return false;
	}

	//
	isElementEnabled( name )
	{
		return false;
	}

}

//
export const DashboardComponent = {

	template: require( './dashboard.component.html' ),
	controller: DashboardController,
	controllerAs: 'vm',
	bindings: {}
};