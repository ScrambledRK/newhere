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

		this.fetchPendings();
	}

	// --------------------------------------- //
	// --------------------------------------- //

	//
	fetchPendings()
	{
		this.API.one( 'cms/users/pending' ).getList()
			.then( ( item ) =>
				{
					this.setPendings( item );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim laden der Daten.' );
				}
			);
	}

	//
	setPendings(item)
	{
		console.log("set pendings:", item );

		//
		this.pendings.push.apply( this.pendings, item );
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