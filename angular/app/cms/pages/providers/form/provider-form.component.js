class ProviderFormController
{
	constructor( SearchService,
				 MapService,
				 ToastService,
				 API,
				 $timeout,
				 $translate,
				 $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		this.SearchService = SearchService;
		this.MapService = MapService;
		this.ToastService = ToastService;
		this.API = API;

		this.$timeout = $timeout;
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$state = $state;
		this.$translate = $translate;

		//
		this.offer = {
			isWithoutAddress: false
		};

		//
		if( $state.params.id )
			this.fetchItem( $state.params.id );

		//
		this.isProcessing = false;

		// ------------ //
		// ------------ //

		//
		let onLanguage = this.$rootScope.$on( "languageChanged", ( event, data ) =>
		{
			this.onLanguageChanged();
		} );

		//
		let onSave = this.$rootScope.$on( "role.createProvider", ( event ) =>
		{
			this.save();
		} );

		//
		let onCheck = this.$rootScope.$on( "role.checkComplete", ( event, ctrl ) =>
		{
			ctrl.canComplete = !this.$scope.aform.$invalid
				&& !this.$scope.aform.$pristine && !this.isProcessing;
		} );

		//
		let onImage = this.$rootScope.$on( "image.changed", ( event ) =>
		{
			this.$scope.ngoForm.$setDirty();
		} );

		this.$scope.$on( '$destroy', () =>
		{
			onLanguage();
			onSave();
			onCheck();
			onImage();
		} );

		// ------------------------------ //
		// ------------------------------ //

		this.label_checkbox_without_address = "without Address (only website)";

		$translate( "provider_form_address_checkbox" ).then( ( msg ) =>
		{
			this.label_checkbox_without_address = msg;
		} );
	}

	//
	onWithoutAddressChange()
	{
		this.$timeout( () =>
		{
			this.MapService.invalidateSize();
		}, 1, false );
	}

	//
	onLanguageChanged( )
	{
		if( this.offer.id )
			this.fetchItem( this.offer.id );

		this.$translate( "provider_form_address_checkbox" ).then( ( msg ) =>
		{
			this.label_checkbox_without_address = msg;
		} );
	}

	//
	fetchItem( id )
	{
		this.API.one( 'cms/providers', id ).get()
			.then( ( item ) =>
				{
					this.setProvider( item );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim laden der Daten.' );
				}
			);
	}

	//
	save()
	{
		this.isProcessing = true;

		if( this.offer.isWithoutAddress )
		{
			this.offer.street = null;
			this.offer.streetnumber = null;
			this.offer.zip = null;
			this.offer.city = null;
		}

		if( !this.offer.id )
		{
			this.offer.published = false;

			this.API.all( 'cms/providers' ).post( this.offer )
				.then( ( response ) =>
					{
						this.ToastService.show( 'Eintrag aktualisiert.' );
						//console.log( "res:", response.data.provider );

						this.setProvider( response.data.provider );
						this.$rootScope.$broadcast( 'role.createProviderComplete', this.offer );

						this.isProcessing = false;
					},
					( error ) =>
					{
						this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
						this.isProcessing = false;
					}
				);
		}
		else
		{
			this.API.one( 'cms/providers', this.offer.id ).customPUT( this.offer )
				.then( ( response ) =>
					{
						this.ToastService.show( 'Eintrag aktualisiert.' );
						//console.log( "res:", response.data.provider );

						this.setProvider( response.data.provider );
						this.$rootScope.$broadcast( 'role.createProviderComplete', this.offer );

						this.isProcessing = false;
					},
					( error ) =>
					{
						this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
						this.isProcessing = false;
					}
				);
		}
	}

	setProvider(item)
	{
		//console.log("setProvider:", item );

		//
		for(let k in item)
		{
			this.offer[k] = item[k];
		}

		//
		this.offer.isWithoutAddress = !this.offer.street;
		this.offer.streetnumber = this.offer.street_number;

		//
		this.updateMap();
	}

	cancel()
	{
		this.$state.go( 'cms.providers' );
	}

	// ------------------------------------------------------- //
	// ------------------------------------------------------- //
	// address

	//
	queryAddress( query )
	{
		return this.SearchService.searchAddress( query )
			.catch( this.failedQueryAddress.bind( this ) );
	}

	//
	selectedAddressChanged( item )
	{
		if( !item )
			return;

		this.offer.street = item.street;
		this.offer.street_number = item.number; // cause stupid db
		this.offer.streetnumber = item.number;
		this.offer.city = item.city;
		this.offer.zip = item.zip;
		this.offer.latitude = item.coordinates[0];
		this.offer.longitude = item.coordinates[1];

		this.updateMap();
	}

	updateMap()
	{
		//console.log("update map:", this.offer );

		this.MapService.markers = {};
		this.MapService.setMarkers( [ this.offer ] );
		this.MapService.zoomTo( this.offer );
		this.MapService.invalidateSize();

		//
		this.$timeout( () => { this.MapService.invalidateSize(); }, 150, false );
	}

	//
	failedQueryAddress( response )
	{
		if( response.data )
		{
			if( response.statusText )
				this.ToastService.error( response.statusText, true );

			if( response.data.errors && response.data.errors.message )
			{
				response.data.errors.message.forEach( function( element )
				{
					this.ToastService.error( element, true );
				}, this );
			}
		}
		else if( response.message )
		{
			this.ToastService.error( response.message, true );
		}
	}
}

export const ProviderFormComponent = {
	template: require( './provider-form.component.html' ),
	controller: ProviderFormController,
	controllerAs: 'vm',
	bindings: {
		buttons: '=buttons'
	}
};
