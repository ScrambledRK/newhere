class RoleAssignmentController
{
	/**
	 */
	constructor( UserService,
	             ProviderService,
	             DialogService,
	             WizardHandler,
	             $rootScope )
	{
		'ngInject';

		this.UserService = UserService;
		this.ProviderService = ProviderService;
		this.DialogService = DialogService;
		this.WizardHandler = WizardHandler;
		this.$rootScope = $rootScope;

		// -------------- //

		this.roles = this.UserService.roles;
		this.providers = this.UserService.providers;

		//
		this.requestGroup = null;

		//
		this.ProviderService.all();
	}

	//
	getURL( item, type )
	{
		switch( type )
		{
			case "provider":
				return "#!/cms/providers/" + item.id;
		}

		return "";
	}

	// --------------------------------------- //
	// --------------------------------------- //

	onRequestGroup( group )
	{
		this.requestGroup = group;

		switch( group )
		{
			case "assign":
			{
				this.providers = this.ProviderService.allProviders;
				break;
			}

			case "leave":
			{
				this.providers = this.UserService.providers;
				break;
			}
		}
	}

	//
	canRequestStepComplete()
	{
		let step = this.WizardHandler.wizard().currentStepNumber();

		if( step === 1 )
			return this.requestGroup !== null;

		return true;
	}

	//
	isLastRequestStep()
	{
		let step = this.WizardHandler.wizard().currentStepNumber();
		let total = this.WizardHandler.wizard().totalStepCount();

		return step === total;
	}

	//
	requestRole()
	{
		this.isRequestDialogOpen = true;
		this.requestGroup = null;

		this.DialogService.fromTemplate('requestRole', {
			controller: () => this,
			controllerAs: 'vm'
		});
	}

	//
	requestNextStep()
	{
		this.WizardHandler.wizard().next();
	}

	//
	requestCancel()
	{
		this.isRequestDialogOpen = false;
		this.DialogService.hide();
	}

	//
	requestComplete()
	{
		console.log("I wanna complete man!", this.requestGroup);

		this.isRequestDialogOpen = false;
		this.DialogService.hide();

		if( this.requestGroup === "create" )
			this.$rootScope.$broadcast( 'createProvider', this );
	}

	// --------------------------------------- //
	// --------------------------------------- //

	//
	isElementVisible( name )
	{
		if( name === "request-join" )
			return this.UserService.isWithoutRole();

		if( name === "providers" )
			return this.UserService.isNgoUser();

		if( name === "provider-box" )
			return !this.UserService.isAdministrator();

		if( name === "roles" )
			return this.UserService.roles.length > 0;

		if( name === "resign" )
			return this.UserService.isModerator();

		if( name === "leave" )
		{
			return !this.UserService.isAdministrator()
				&& this.UserService.providers.length > 0;
		}

		//
		return false;
	}

	//
	isElementEnabled( name )
	{
		return false;
	}

	//
	isAdmin()
	{
		return this.UserService.isAdministrator();
	}
}

//
export const RoleAssignmentComponent = {

	template: require( './role-assignment.component.html' ),
	controller: RoleAssignmentController,
	controllerAs: 'vm',
	bindings: {}
};