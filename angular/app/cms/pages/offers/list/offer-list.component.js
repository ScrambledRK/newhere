class OfferListController
{
	constructor( $sessionStorage,
	             $rootScope,
	             $state,
	             $q,
	             API,
	             UserService,
	             ToastService,
	             DialogService,
	             OfferService )
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
		this.OfferService = OfferService;

		//
		this.providers = this.UserService.providers;
		this.assignProvider = this.providers[0];

		this.selectedItems = [];
		this.loading = true;

		//
		this.promise = null;

		this.items = this.OfferService.offers;
		this.numItems = this.OfferService.numItems;

		//
		this.query =
			{
				order: 'updated_at',
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

			vm.promise = this.OfferService.fetchList( vm.query )
				.then( () =>
				{
					vm.loading = false;
					vm.promise = null;

					vm.numItems = vm.OfferService.numItems;
				} )
			;
		};

		this.onQueryUpdate();
	}

	//
	onProviderChange( item )
	{
		if( this.isAssignNgoDialogOpen )
		{
			this.assignProvider = item;
		}
		else
		{
			if( item )
			{
				this.query.ngo_id = item.id;
				this.onQueryUpdate();
			}
			else
			{
				delete this.query.ngo_id;
				this.onQueryUpdate();
			}
		}
	}

	//
	getURL( item, type )
	{
		switch( type )
		{
			case "provider":
				return "#!/cms/providers/" + item.ngo.id;

			case "frontend":
				return "#!/offers/start/" + item.id;
		}

		return "";
	}

	//
	createItem()
	{
		this.$state.go( 'cms.offers.new' );
	}

	//
	editItem( item )
	{
		this.$state.go( 'cms.offers.edit', { id: item.id } );
	}

	//
	toggleItem( item, isEnabled )
	{
		item.enabled = isEnabled;

		this.OfferService.updateList( [item] )
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
		this.DialogService.prompt( 'Deleting Offers?',
			'You are about to delete offer(s). Type in DELETE and confirm?',
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
					this.OfferService.deleteList( this.selectedItems )
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
	assignSelectedItems()
	{
		this.isAssignNgoDialogOpen = true;

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
		this.OfferService.updateList( this.selectedItems )
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

	//
	enableSelectedItems( isEnabled )
	{
		angular.forEach( this.selectedItems, ( item ) =>
		{
			item.enabled = isEnabled;
		} );

		//
		this.OfferService.updateList( this.selectedItems )
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
		if( name === "enable-dial" )
			return this.UserService.isAdministrator();

		if( name === "provider" )
		{
			if( this.UserService.isAdministrator() )
				return true;

			if( this.UserService.providers.length <= 1 )
				return false;
		}

		if( name === "create" )
		{
			if( this.UserService.isModerator() )
				return false;
		}

		return true;
	}

	//
	isElementEnabled( name )
	{
		if( name === "enabled" )
		{
			if( this.UserService.isAdministrator() )
				return false;
		}

		return true;
	}
}

export const OfferListComponent = {
	template: require( './offer-list.component.html' ),
	controller: OfferListController,
	controllerAs: 'vm'
};
