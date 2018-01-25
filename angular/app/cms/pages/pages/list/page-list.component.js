class PageListController
{
	constructor( $rootScope,
	             $state,
	             $q,
	             API,
	             UserService,
	             ToastService,
	             DialogService,
	             PageService )
	{
		'ngInject';

		//
		let vm = this;

		//
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$q = $q;

		this.API = API;
		this.UserService = UserService;
		this.ToastService = ToastService;
		this.DialogService = DialogService;
		this.PageService = PageService;

		//
		this.selectedItems = [];
		this.loading = true;

		//
		this.promise = null;

		this.items = this.PageService.pages;
		this.numItems = this.PageService.numItems;

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

			vm.promise = this.PageService.fetchList( vm.query )
				.then( () =>
				{
					vm.loading = false;
					vm.promise = null;

					vm.numItems = vm.PageService.numItems;
				} )
			;
		};

		this.onQueryUpdate();
	}

	// --------------------------------------- //
	// --------------------------------------- //

	//
	getURL( item, type )
	{
		return "";
	}

	//
	createItem()
	{
		this.$state.go( 'cms.pages.new' );
	}

	//
	editItem( item )
	{
		this.$state.go( 'cms.pages.edit', { id: item.id } );
	}

	//
	toggleItem( item, isEnabled )
	{
		item.enabled = isEnabled;

		this.PageService.updateList( [item] )
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
		this.DialogService.prompt( 'Deleting Pages?',
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
					this.PageService.deleteList( this.selectedItems )
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
			item.enabled = isEnabled;
		} );

		//
		this.PageService.updateList( this.selectedItems )
			.then( ( response ) =>
				{
					this.ToastService.show(
						sprintf( '%d Eintrag aktualisiert.', this.selectedItems.length )
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
		if( name === "provider" )
			return false;

		return true;
	}

	//
	isElementEnabled( name )
	{
		return true;
	}
}

export const PageListComponent = {
	template: require( './page-list.component.html' ),
	controller: PageListController,
	controllerAs: 'vm'
};
