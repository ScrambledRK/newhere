class ProfileController
{
	/**
	 */
	constructor( UserService,
	             ProviderService,
	             DialogService,
	             WizardHandler,
	             ToastService,
	             API,
	             $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		this.UserService = UserService;
		this.ProviderService = ProviderService;
		this.DialogService = DialogService;
		this.WizardHandler = WizardHandler;
		this.ToastService = ToastService;
		this.API = API;

		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$state = $state;

		// -------------- //
		// -------------- //

		this.roles = this.UserService.roles;
		this.providers = this.UserService.providers;

		//
		this.requestGroup = null;

		//
		this.ProviderService.all();

		// -------------- //
		// -------------- //

		//
		let onCheck = this.$rootScope.$on( "role.createProviderComplete", ( event, item ) =>
		{
			this.assignProvider = item;
			this.finalize();
		} );

		this.$scope.$on( '$destroy', () =>
		{
			onCheck();
		} );
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

	changePassword()
	{
		this.$state.go( 'main.resetpassword', {token:""} );
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
	onProviderChange( item )
	{
		this.assignProvider = item;
	}

	//
	canRequestStepComplete()
	{
		let step = this.WizardHandler.wizard().currentStepNumber();

		if( step === 1 )
			return this.requestGroup !== null;

		if( step === 2 )
		{
			switch( this.requestGroup )
			{
				case "leave":
					return this.leaveGroup !== null;

				case "create":
				{
					this.$rootScope.$broadcast( 'role.checkComplete', this );
					return this.canComplete;
				}

				case "assign":
					return this.assignProvider !== null;
			}
		}

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
		this.assignProvider = null;
		this.canComplete = false;
		this.isRequestDialogOpen = true;
		this.requestGroup = null;
		this.leaveGroup = null;

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
		console.log("cancel", this.requestGroup);

		this.isRequestDialogOpen = false;
		this.DialogService.hide();
	}

	//
	requestComplete()
	{
		console.log("I wanna complete man!", this.requestGroup);

		if( this.requestGroup === "create" )
		{
			this.$rootScope.$broadcast( 'role.createProvider', this );
		}
		else
		{
			this.finalize();
		}
	}

	finalize()
	{
		console.log("finalize");

		//
		let request = {};

		//
		if( this.requestGroup === "leave" || this.requestGroup === "resign" )
		{
			request.type = 0;
		}
		else
		{
			request.type = 1;
		}

		//
		if( this.requestGroup === "create" )
		{
			request.ngo_id = this.assignProvider.id;
			request.role_id = 3; // org-admin
		}
		if( this.requestGroup === "assign" )
		{
			request.ngo_id = this.assignProvider.id;
			request.role_id = 4; // org-user
		}
		if( this.requestGroup === "leave" )
		{
			request.ngo_id = this.leaveGroup;
			request.role_id = 4; // org-user
		}

		//
		if( this.requestGroup === "translate" )
		{
			request.ngo_id = null; // moderator
			request.role_id = 5; // moderator
		}

		//
		this.API.all( 'cms/users/pending' ).post( request )
			.then( ( response ) =>
				{
					this.ToastService.show( 'Erfolgreich gespeichert.' );

					console.log( "penres:", response.data.pending );
					this.UserService.user.pendings.push( response.data.pending );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim Speichern der Daten.' );
				}
			);

		this.isRequestDialogOpen = false;
		this.DialogService.hide();
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
export const ProfileComponent = {

	template: require( './profile.component.html' ),
	controller: ProfileController,
	controllerAs: 'vm',
	bindings: {}
};