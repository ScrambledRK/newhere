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
				order: '-id',
				limit: 10,
				page: 1
			};

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
					this.ToastService.show( 'Angebot aktualisiert.' );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim Speichern der Daten.' );
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
								sprintf( '%d Angebote gelöscht.', this.selectedItems.length )
							);
						},
						( error ) =>
						{
							this.ToastService.error( 'Fehler beim löschen der Daten.' );
							this.onQueryUpdate();
						} );
				}
			} );

	}

	//
	assignSelectedItems(){
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
						sprintf( '%d Angebote aktualisiert.', this.selectedItems.length )
					);
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim Speichern der Daten.' );
					this.onQueryUpdate();
				}
			);

		this.DialogService.hide();
	}

	//
	assignCancel()
	{
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
						sprintf( '%d Angebote aktualisiert.', this.selectedItems.length )
					);
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim aktualisieren der Daten.' );
					this.onQueryUpdate();
				} );
	}

	// --------------------------------------- //
	// --------------------------------------- //

	//
	isElementVisible( name )
	{
		if( name === "provider" )
		{
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
