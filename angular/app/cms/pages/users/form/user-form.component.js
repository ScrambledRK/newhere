class UserFormController
{
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

		this.assignProvider = null;

		this.providers = this.ProviderService.allProviders;
		this.ProviderService.all();

		//
		this.roles = this.UserService.all_roles;
		this.UserService.allRoles();

		//
		this.user = {
			ngos : [],
			roles : [],
			pendings : [],
			languages : []
		};

		//
		if( $state.params.id )
			this.fetchItem( $state.params.id );

		// -------------- //
		// -------------- //

		//
		let onCheck = this.$rootScope.$on( "request.accept", ( event, item ) =>
		{
			this.performPendingRequest( item );
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

	//
	fetchItem( id )
	{
		this.API.one( 'cms/users', id ).get()
			.then( ( item ) =>
				{
					this.setUser( item );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim laden der Daten.' );
				}
			);
	}

	//
	setUser(item)
	{
		console.log("set user:", item );

		//
		for(let k in item)
		{
			switch( k )
			{
				case "ngos":
				case "roles":
				case "pendings":
				case "languages":
				{
					this.user[k].length = 0;
					break;
				}

				default:
				{
					delete this.user[k];
					break;
				}
			}
		}

		//
		for(let k in item)
		{
			switch( k )
			{
				case "ngos":
				case "roles":
				case "pendings":
				case "languages":
				{
					this.user[k].push.apply( this.user[k], item[k] );
					break;
				}

				default:
				{
					this.user[k] = item[k];
					break;
				}
			}
		}

		//
		if( !this.user.ngos )
			this.user.ngos = [];

		if( !this.user.roles )
			this.user.roles = [];

		if( !this.user.pendings )
			this.user.pendings = [];

		//
		this.$scope.userForm.$setPristine();
	}

	// ------------------------------------------- //
	// ------------------------------------------- //

	//
	onProviderChange( item )
	{
		this.assignProvider = item;
	}

	//
	assignSelectedProvider()
	{
		if( this.assignProvider !== null )
			this.user.ngos.push( this.assignProvider );

		this.assignProvider = null;
	}

	//
	performPendingRequest( request )
	{
		console.log( "performPendingRequest", request );

		if( request.type === 0 )
		{
			if( request.ngo )
			{
				let idx = this.indexOfProvider( request.ngo );

				if( idx !== -1 )
					this.user.ngos.splice( idx, 1 );
			}

			if( request.role )
			{
				let idx = this.indexOfRole( request.role );

				if( idx !== -1 )
					this.user.roles.splice( idx, 1 );
			}
		}
		else
		{
			if( request.ngo )
			{
				let idx = this.indexOfProvider( request.ngo );

				if( idx === -1 )
					this.user.ngos.push( request.ngo );
			}

			if( request.role )
			{
				let idx = this.indexOfRole( request.role );

				if( idx === -1 )
					this.user.roles.push( request.role );
			}
		}

		console.log(this.user);
		this.$scope.userForm.$setDirty();
	}

	// ------------------------------------------- //
	// ------------------------------------------- //

	/**
	 *
	 */
	save()
	{
		console.log("save user:", this.user );

		//
		if( this.user.id )
		{
			this.updateItem();
		}
		else
		{
			this.createItem();
		}
	}

	//
	updateItem()
	{
		this.API.one( 'cms/users', this.user.id ).customPUT( this.user )
			.then( ( response ) =>
				{
					this.ToastService.show( 'Erfolgreich gespeichert.' );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim Speichern der Daten.' );
				}
			);
	}

	//
	createItem()
	{
		this.user.confirmed = false;

		//
		this.API.all( 'cms/users' ).post( this.user )
			.then( ( response ) =>
				{
					this.ToastService.show( 'Erfolgreich gespeichert.' );
					console.log( "res:", response.data.user );

					this.setUser( response.data.user );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim Speichern der Daten.' );
				}
			);
	}

	// ------------------------------------------- //
	// ------------------------------------------- //

	//
	hasRole(item)
	{
		return this.indexOfRole(item) !== -1;
	}

	//
	toggleRole(item)
	{
		if( this.hasRole(item) )
		{
			this.user.roles.splice( this.indexOfRole(item), 1 );
		}
		else
		{
			this.user.roles.push( item );
		}

		this.$scope.userForm.$setDirty();
	}

	//
	indexOfRole( item )
	{
		let result = -1;

		angular.forEach( this.user.roles, ( role, index ) =>
		{
			if( role.id === item.id )
				result = index;
		} );

		return result;
	}

	//
	indexOfProvider( item )
	{
		let result = -1;

		angular.forEach( this.user.ngos, ( ngo, index ) =>
		{
			if( ngo.id === item.id )
				result = index;
		} );

		return result;
	}

}

export const UserFormComponent = {
	template: require( './user-form.component.html' ),
	controller: UserFormController,
	controllerAs: 'vm'
};
