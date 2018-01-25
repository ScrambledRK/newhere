class UserListController
{
	constructor( $sessionStorage,
	             $rootScope,
	             $state,
	             $q,
	             API,
	             UserService,
	             ToastService,
	             DialogService )
	{
		'ngInject';

		//
		let vm = this;

		//
		this.$sessionStorage = $sessionStorage;
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$q = $q;

		this.API = API;
		this.UserService = UserService;
		this.ToastService = ToastService;
		this.DialogService = DialogService;

		//
		this.providers = this.UserService.providers;

		//
		this.selectedItems = [];
		this.loading = true;

		//
		this.promise = null;

		this.items = this.UserService.users;
		this.numItems = this.UserService.numItems;

		//
		this.query =
			{
				order: '-id',
				limit: 10,
				page: 1
			};

		// pre-filter
		if( this.$state.params.ngo )
		{
			this.query.ngo_id = this.$state.params.ngo;
		}

		// --------------- //
		// --------------- //

		/**
		 * not a "member" method because of stupid bug where "this" reference is lost
		 * this issue is specific to material design components
		 */
		this.onQueryUpdate = () =>
		{
			this.selectedItems = [];

			vm.promise = this.UserService.fetchList( vm.query )
				.then( () =>
				{
					vm.loading = false;
					vm.promise = null;

					vm.numItems = vm.UserService.numItems;
				} )
			;
		};

		this.onQueryUpdate();
	}

	//
	getURL( item, type )
	{
		switch( type )
		{
			case "provider":
				return "#!/cms/providers/" + item.id;

			case "frontend":
				return "#!/offers/start/" + item.id;
		}

		return "";
	}

	//
	createItem()
	{
		this.$state.go( 'cms.users.new' );
	}

	//
	editItem( item )
	{
		this.$state.go( 'cms.users.edit', { id: item.id } );
	}

	//
	toggleItem( item, isEnabled )
	{
		item.confirmed = isEnabled;

		this.UserService.updateList( [item] )
			.then( ( success ) =>
				{
					this.ToastService.show( 'Eintrag aktualisiert.' );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
					this.onQueryUpdate();
				}
			);
	}

	//
	deleteSelectedItems()
	{
		this.DialogService.prompt( 'Deleting Providers?',
			'You are about to delete user(s). Type in DELETE and confirm?',
			'Delete Secret' )
			.then( ( response ) =>
			{
				if( response !== "DELETE" )
				{
					this.DialogService.alert( 'Not correct',
						'Thankfully, you entered the wrong secret. So nothing is going to change... for now.' );
				}
				else
				{
					this.UserService.deleteList( this.selectedItems )
						.then( ( response ) =>
						{
							this.ToastService.show(
								sprintf( '%d Einträge gelöscht.', this.selectedItems.length )
							);
						},
						( error ) =>
						{
							this.ToastService.error( 'Fehler beim löschen der Einträge.' );
							this.onQueryUpdate();
						} );
				}
			} );

	}

	//
	enableSelectedItems( isEnabled )
	{
		angular.forEach( this.selectedItems, ( item ) =>
		{
			item.confirmed = isEnabled;
		} );

		//
		this.UserService.updateList( this.selectedItems )
			.then( ( response ) =>
				{
					this.ToastService.show(
						sprintf( '%d Einträge aktualisiert.', this.selectedItems.length )
					);
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
					this.onQueryUpdate();
				} );
	}

	//
	assignSelectedItems()
	{
		this.isAssignNgoDialogOpen = true;
		this.assignProvider = null;

		this.DialogService.fromTemplate('assignToNgo', {
			controller: () => this,
			controllerAs: 'vm'
		});
	}

	//
	assignSave()
	{
		angular.forEach( this.selectedItems, ( item ) =>
		{
			item.ngo_id = this.assignProvider.id;
			item.ngo = this.assignProvider;
		} );

		//
		this.UserService.updateList( this.selectedItems )
			.then( ( success ) =>
				{
					this.ToastService.show(
						sprintf( '%d Einträge aktualisiert.', this.selectedItems.length )
					);
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
					this.onQueryUpdate();
				}
			);

		this.isAssignNgoDialogOpen = false;
		this.DialogService.hide();
	}

	//
	assignCancel()
	{
		this.isAssignNgoDialogOpen = false;
		this.DialogService.hide();
	}

	// --------------------------------------- //
	// --------------------------------------- //

	//
	isElementVisible( name )
	{
		if( name === "edit" )
			return this.UserService.isAdministrator();

		if( name === "delete" )
			return this.UserService.isAdministrator();

		if( name === "enable-dial" )
			return this.UserService.isAdministrator();

		if( name === "provider" )
			return this.UserService.isAdministrator();

		if( name === "create" )
			return this.UserService.isAdministrator();

		if( name === "enabled" )
			return true;

		if( name === "pending" )
			return this.UserService.isAdministrator();

		if( name === "select" )
			return this.UserService.isAdministrator();

		//
		return false;
	}

	//
	isElementEnabled( name )
	{
		if( name === "enabled" )
		{
			if( this.UserService.isAdministrator() )
				return true;
		}

		return false;
	}
}

export const UserListComponent = {
	template: require( './user-list.component.html' ),
	controller: UserListController,
	controllerAs: 'vm'
};
