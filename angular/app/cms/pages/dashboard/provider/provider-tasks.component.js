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

		this.providers = this.ProviderService.providers;
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

			vm.promise = this.ProviderService.fetchList( vm.query, true )
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

	editItem( item, type )
	{
		if( type === 'note')
		{
			console.log( item );

			if( !item.notes || !item.notes.id )
				item.notes = { id: item.id };

			this.note = item.notes;
			this.item = item;
			this.items = item.users;

			//
			this.DialogService.fromTemplate('providerNotes', {
				controller: () => this,
				controllerAs: 'vm'
			});
		}
		else
		{
			this.$state.go( 'cms.users.edit', { id: item.id } );
		}
	}
	//
	requestCancel()
	{
		this.DialogService.hide();
		this.items = null;
		this.item = null;
		this.note = null;
	}

	//
	requestComplete( i, n )
	{
		if( !i ) i = this.item;
		if( !n ) n = this.note;

		//
		n.user_id = this.UserService.user.id;

		//
		let payload = {
			id: i.id,
			note_checked: n.checked,
			note_content: n.notes,
			contact: i.contact,
			contact_email: i.contact_email,
			contact_phone: i.contact_phone,
			user_id : n.user_id
		};

		this.API.one( 'cms/notes', this.item.id ).customPUT( payload )
			.then( ( response ) =>
				{
					this.ToastService.show( 'Eintrag aktualisiert.' );

					this.item = response.data.provider;
					this.note = this.item.notes;
					this.items = this.item.users;

					//
					let idx = this.ProviderService.indexOf( this.item.id );

					if( idx !== -1 )
						this.ProviderService.providers[idx] = this.item;
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
				}
			);

		//
		this.DialogService.hide();
		this.items = null;
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
		if( !item )
			return "";

		switch( type )
		{
			case "offer":
				return "#!/cms/offers/" + item.id;

			case "user":
				return "#!/cms/users/" + item.id;

			case "user_detail":
				return "#!/cms/users//" + item.id;

			case "frontend":
				return "#!/providers/" + item.id;

			case "cms":
				return "#!/cms/providers//" + item.id;
		}

		return "";
	}

	isElementVisible( name )
	{
		if( name === "edit" )
			return false;

		if( name === "select" )
			return false;

		if( name === 'updated_at' )
			return false;

		if( name === 'provider' )
			return false;

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