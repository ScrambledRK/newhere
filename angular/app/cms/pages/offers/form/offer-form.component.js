class OfferFormController
{
	constructor( $state,
	             $timeout,
	             $scope,
	             API,
	             UserService,
	             ToastService,
	             SearchService,
	             MapService )
	{
		'ngInject';

		this.API = API;
		this.UserService = UserService;
		this.ToastService = ToastService;
		this.SearchService = SearchService;
		this.MapService = MapService;
		this.$timeout = $timeout;
		this.$scope = $scope;

		//
		this.providers = this.UserService.providers;
		this.searchAddress = "";
		this.category = {};

		//
		this.offer = {
			isWithoutAddress: true,
			categories: [],
			filters: [],
			translations: []
		};

		//
		if( $state.params.id )
			this.fetchItem( $state.params.id );
	}

	//
	fetchItem( id )
	{
		this.API.one( 'cms/offers', id ).get()
			.then( ( item ) =>
				{
					this.setOffer( item );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim laden der Daten.' );
				}
			);
	}

	/**
	 *
	 * @param item
	 */
	setOffer( item )
	{
		this.offer = item;

		if( this.offer.valid_from )
			this.valid_from = new Date( this.offer.valid_from );

		if( this.offer.valid_until )
			this.valid_until = new Date( this.offer.valid_until );

		if( !this.offer.street )
			this.offer.isWithoutAddress = true;

		if( !this.offer.categories )
			this.offer.categories = [];

		if( !this.offer.translations )
			this.offer.translations = [];

		if( !this.offer.filters )
			this.offer.filters = [];

		//
		this.updateMap();
	}

	/**
	 *
	 */
	save()
	{
		if( this.offer.isWithoutAddress )
		{
			this.offer.street = null;
			this.offer.streetnumber = null;
			this.offer.zip = null;
			this.offer.city = null;
		}

		//
		if( this.validateForm() )
		{
			if( this.offer.id )
			{
				this.updateItem();
			}
			else
			{
				this.createItem();
			}
		}
	}

	//
	updateItem()
	{
		this.API.one( 'cms/offers', this.offer.id ).customPUT( this.offer )
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
		this.API.all( 'cms/offers' ).post( this.offer )
			.then( ( response ) =>
				{
					this.ToastService.show( 'Erfolgreich gespeichert.' );
					console.log( "res:", response.data.offer );

					this.setOffer( response.data.offer );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim Speichern der Daten.' );
				}
			);
	}

	//
	validateForm()
	{
		this.offer.valid_until = this.valid_until;
		this.offer.valid_from = this.valid_from;

		if( new Date() > this.offer.valid_until )
		{
			this.ToastService.error( 'Enddatum liegt in der Vergangenheit!' );
			return false;
		}

		return true;
	}


	// ------------------------------------------------------- //
	// ------------------------------------------------------- //
	// address

	queryAddress( query )
	{
		return this.SearchService.searchAddress( query )
			.catch( this.failedQueryAddress.bind( this ) );
	}

	selectedAddressChanged( item )
	{
		if( !item )
			return;

		this.offer.street = item.street;
		this.offer.streetnumber = item.number;
		this.offer.city = item.city;
		this.offer.zip = item.zip;
		this.offer.latitude = item.coordinates[0];
		this.offer.longitude = item.coordinates[1];

		this.updateMap();
	}

	updateMap()
	{
		console.log("update map:", this.offer );

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
				this.ToastService.error( response.statusText );

			if( response.data.errors && response.data.errors.message )
			{
				response.data.errors.message.forEach( function( element )
				{
					this.ToastService.error( element );
				}, this );
			}
		}
		else if( response.message )
		{
			this.ToastService.error( response.message );
		}
	}
}

export const OfferFormComponent = {
	template: require( './offer-form.component.html' ),
	controller: OfferFormController,
	controllerAs: 'vm'
};
