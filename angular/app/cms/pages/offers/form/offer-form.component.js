class OfferFormController
{
	constructor( $state,
	             $timeout,
	             $scope,
	             $rootScope,
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
		this.$rootScope = $rootScope;
		this.$state = $state;

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

		// ------------------------------ //
		// ------------------------------ //

		//
		let onLanguage = this.$rootScope.$on( "languageChanged", ( event, data ) =>
		{
			this.onLanguageChanged();
		} );

		//
		let onImage = this.$rootScope.$on( "image.changed", ( event ) =>
		{
			this.$scope.offerForm.$setDirty();
		} );

		this.$scope.$on( '$destroy', () =>
		{
			onImage();
			onLanguage();
		} );
	}

	//
	onLanguageChanged()
	{
		if( this.offer.id )
			this.fetchItem( this.offer.id );
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
					this.ToastService.error( 'Unbekannter Fehler aufgetreten.' );
				}
			);
	}

	/**
	 * I am sorry for the code below; I do not seem to understand
	 * how angular watches references, so I do whatever it takes
	 * to keep the same object instance (this.offer) and its arrays
	 *
	 * @param item
	 */
	setOffer( item )
	{
		//console.log("set offer:", item );

		//
		for(let k in item)
		{
			switch( k )
			{
				case "translations":
				case "categories":
				case "filters":
				{
					this.offer[k].length = 0;
					break;
				}

				default:
				{
					delete this.offer[k];
					break;
				}
			}
		}

		//
		for(let k in item)
		{
			switch( k )
			{
				case "translations":
				case "categories":
				case "filters":
				{
					this.offer[k].push.apply( this.offer[k], item[k] );
					break;
				}

				default:
				{
					this.offer[k] = item[k];
					break;
				}
			}
		}

		//
		if( this.offer.valid_from )
			this.valid_from = new Date( this.offer.valid_from );

		if( this.offer.valid_until )
			this.valid_until = new Date( this.offer.valid_until );

		//
		this.offer.isWithoutAddress = !this.offer.street;

		if( !this.offer.categories )
			this.offer.categories = [];

		if( !this.offer.translations )
			this.offer.translations = [];

		if( !this.offer.filters )
			this.offer.filters = [];

		//
		this.updateMap();

		//
		this.$rootScope.$broadcast( 'categoriesChanged', this );
		this.$rootScope.$broadcast( 'filterChanged', this );

		//
		//console.log("got offer:", this.offer );
	}

	/**
	 *
	 */
	save()
	{
		//console.log("save offer:", this.offer );

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
					this.ToastService.show( 'Eintrag aktualisiert.' );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
				}
			);
	}

	//
	createItem()
	{
		this.API.all( 'cms/offers' ).post( this.offer )
			.then( ( response ) =>
				{
					this.ToastService.show( 'Eintrag aktualisiert.' );
					//console.log( "res:", response.data.offer );

					this.setOffer( response.data.offer );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
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

	//
	toggleItem( isEnabled )
	{
		if( this.offer )
		{
			if( this.offer.enabled !== isEnabled )
				this.$scope.offerForm.$setDirty();

			this.offer.enabled = isEnabled;
		}
	}

	cancel()
	{
		this.$state.go( 'cms.offers' );
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
