class ProviderListController
{
	constructor( $sessionStorage,
	             $rootScope,
	             $state,
	             $q,
	             API,
	             UserService,
	             ToastService,
	             DialogService,
	             ProviderService )
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
		this.ProviderService = ProviderService;

		//
		this.selectedItems = [];
		this.loading = true;

		//
		this.promise = null;

		this.items = this.ProviderService.providers;
		this.numItems = this.ProviderService.numItems;

		//
		this.query =
			{
				withCounts: true,
				order: 'updated_at',
				limit: 10,
				page: 1
			};

		// pre-filter
		if( this.$state.params.ngo )
		{
			let ngo = this.UserService.getProviderByID( parseInt(this.$state.params.ngo) );

			if( ngo )
				this.query.title = ngo.organisation;
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

			vm.promise = this.ProviderService.fetchList( vm.query )
				.then( () =>
				{
					vm.loading = false;
					vm.promise = null;

					vm.numItems = vm.ProviderService.numItems;
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
			case "offer":
				return "#!/cms/offers/" + item.id;

			case "user":
				return "#!/cms/users/" + item.id;

			case "frontend":
				return "#!/providers/" + item.id;
		}

		return "";
	}

	//
	createItem()
	{
		this.$state.go( 'cms.providers.new' );
	}

	//
	editItem( item )
	{
		this.$state.go( 'cms.providers.edit', { id: item.id } );
	}

	//
	toggleItem( item, isEnabled )
	{
		item.published = isEnabled;

		this.ProviderService.updateList( [item] )
			.then( ( success ) =>
				{
					this.ToastService.show( 'Eintrag aktualisiert.' );
				},
				( error ) =>
				{
					this.ToastService.error( "Fehler beim aktualisieren der Einträge." );
					this.onQueryUpdate();
				}
			);
	}

	//
	deleteSelectedItems()
	{
		this.DialogService.prompt( 'Deleting Providers?',
			'You are about to delete providers(s). Type in DELETE and confirm?',
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
					this.ProviderService.deleteList( this.selectedItems )
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
			item.published = isEnabled;
		} );

		//
		this.ProviderService.updateList( this.selectedItems )
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

	// --------------------------------------- //
	// --------------------------------------- //

	//
	isElementVisible( name )
	{
		if( name === "edit" )
		{
			return this.UserService.isAdministrator() ||
				this.UserService.isNgoAdministrator();
		}

		if( name === "delete" )
			return this.UserService.isAdministrator();

		if( name === "enable-dial" )
			return this.UserService.isAdministrator();

		if( name === "provider" )
			return false;

		if( name === "create" )
		{
			if( this.UserService.isAdministrator() )
				return true;
		}

		if( name === "enabled" )
			return true;

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

export const ProviderListComponent = {
	template: require( './provider-list.component.html' ),
	controller: ProviderListController,
	controllerAs: 'vm'
};
