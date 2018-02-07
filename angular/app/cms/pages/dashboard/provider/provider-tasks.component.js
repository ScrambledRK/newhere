class ProviderTasksController
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

	// --------------------------------------- //
	// --------------------------------------- //

	editItem( item )
	{
		console.log( item );

		if( !item.notes || !item.notes.id )
			item.notes = { id: item.id };

		this.note = item.notes;
		this.item = item;

		//
		this.DialogService.fromTemplate('providerNotes', {
			controller: () => this,
			controllerAs: 'vm'
		});
	}
	//
	requestCancel()
	{
		this.DialogService.hide();
		this.item = null;
		this.note = null;
	}

	//
	requestComplete( i, n )
	{
		if( !i ) i = this.item;
		if( !n ) n = this.note;

		let payload = {
			id: i.id,
			note_checked: n.checked,
			note_content: n.notes,
			contact: i.contact,
			contact_email: i.contact_email,
			contact_phone: i.contact_phone
		};

		this.API.one( 'cms/providers/note', this.item.id ).customPUT( payload )
			.then( ( response ) =>
				{
					this.ToastService.show( 'Eintrag aktualisiert.' );

					this.item = response.data.provider;
					this.note = this.item.note;
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
				}
			);

		//
		this.DialogService.hide();
		this.item = null;
		this.note = null;
	}

	// --------------------------------------- //
	// --------------------------------------- //

	//
	toggleItem( item, value )
	{
		console.log("toggle", item, value );

		let note = item;

		if( item.note_id )
			note = item.notes;

		//
		note.checked = value;

		// if( item.note_id )
		// 	this.requestComplete( item, item.notes );
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

	isElementVisible( name )
	{
		return true;
	}

	isElementEnabled( name )
	{
		return true;
	}
}

//
export const ProviderTasksComponent = {

	template: require( './provider-tasks.component.html' ),
	controller: ProviderTasksController,
	controllerAs: 'vm',
	bindings: {}
};