class OfferFormController
{
	constructor( $state,
	             $timeout,
	             $scope,
	             $rootScope,
	             $translate,
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
		this.$translate = $translate;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$state = $state;

		//
		this.providers = this.UserService.providers;
		this.searchAddress = "";
		this.category = {};

		//
		this.isValidFromPickerOpen = false;
		this.isValidUntilPickerOpen = false;

		this.now = this.getDateText( new Date() );

		//
		this.offer = {
			isWithoutValidFrom: true,
			isWithoutValidUntil: true,
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

		// ------------------------------ //
		// ------------------------------ //

		this.label_checkbox_without_address = "without Address (only website)";

		$translate( "offer_form_address_checkbox" ).then( ( msg ) =>
		{
			this.label_checkbox_without_address = msg;
		} );

		//
		this.updateValidText();
	}

	//
	getDateText( date )
	{
		if( !date )
			return "";

		let dd = date.getDate();
		let mm = date.getMonth()+1;
		let yyyy = date.getFullYear();

		if(dd<10){
			dd='0'+dd;
		}
		if(mm<10){
			mm='0'+mm;
		}

		return dd + '.' + mm + '.' + yyyy;
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
	onLanguageChanged()
	{
		if( this.offer.id )
			this.fetchItem( this.offer.id );

		this.$translate( "offer_form_address_checkbox" ).then( ( msg ) =>
		{
			this.label_checkbox_without_address = msg;
		} );
	}

	//
	fetchItem( id )
	{
		this.isSaving = true;

		this.API.one( 'cms/offers', id ).get()
			.then( ( item ) =>
				{
					this.setOffer( item );
					this.isSaving = false;
				},
				( error ) =>
				{
					this.ToastService.error( 'Unbekannter Fehler aufgetreten.' );
					this.ToastService.error( error, true );
					this.isSaving = false;
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

		if( this.offer.valid_from )
		{
			this.valid_from = new Date( this.offer.valid_from );
			this.offer.isWithoutValidFrom = false;
		}
		else
		{
			this.valid_from = null;
			this.offer.isWithoutValidFrom = true;
		}

		if( this.offer.valid_until )
		{
			this.valid_until = new Date( this.offer.valid_until );
			this.offer.isWithoutValidUntil = false;
		}
		else
		{
			this.valid_until = null;
			this.offer.isWithoutValidUntil = true;
		}

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
		this.updateValidText();

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

		if( !this.offer.enabled )
			this.offer.enabled = false;

		//
		if( !this.offer.hasOwnProperty('ngo_id') || !this.offer.ngo_id )
		{
			if( this.providers.length === 1 )
				this.offer.ngo_id = this.providers[0].id;
		}

		//
		this.onValidChange();

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
		this.isSaving = true;

		this.API.one( 'cms/offers', this.offer.id ).customPUT( this.offer )
			.then( ( response ) =>
				{
					this.ToastService.show( 'Eintrag aktualisiert.' );
					this.isSaving = false;
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
					this.ToastService.error( error, true );
					this.isSaving = false;
				}
			);
	}

	//
	createItem()
	{
		this.isSaving = true;

		this.API.all( 'cms/offers' ).post( this.offer )
			.then( ( response ) =>
				{
					this.ToastService.show( 'Eintrag aktualisiert.' );
					//console.log( "res:", response.data.offer );

					this.setOffer( response.data.offer );
					this.isSaving = false;
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
					this.ToastService.error( error, true );
					this.isSaving = false;
				}
			);
	}

	//
	validateForm()
	{
		this.offer.valid_until = this.valid_until;
		this.offer.valid_from = this.valid_from;

		if( this.offer.valid_from && this.offer.valid_until )
		{
			if( this.valid_from.getTime() > this.valid_until.getTime() )
			{
				this.ToastService.error( 'Enddatum liegt vor Startdatum!' );
				return false;
			}
		}

		if( this.offer.categories.length === 0 )
		{
			this.ToastService.error( 'offer_form_error_no_category' );
			return false;
		}

		if( !this.offer.hasOwnProperty('ngo_id') || !this.offer.ngo_id )
		{
			this.ToastService.error( 'offer_form_error_no_provider' );
			return false;
		}

		return true;
	}

	onValidChange( isCheckbox )
	{
		if( isCheckbox )
		{
			if( this.offer.isWithoutValidFrom )
				this.valid_from = null;

			if( this.offer.isWithoutValidUntil )
				this.valid_until = null;
		}
		else
		{
			if( this.valid_from )
			{
				this.offer.isWithoutValidFrom = false;
			}
			else
			{
				this.offer.isWithoutValidFrom = true;
			}

			if( this.valid_until )
			{
				this.offer.isWithoutValidUntil = false;
			}
			else
			{
				this.offer.isWithoutValidUntil = true;
			}
		}

		this.isValidFromPickerOpen = !this.offer.isWithoutValidFrom && !this.valid_from;
		this.isValidUntilPickerOpen = !this.offer.isWithoutValidUntil && !this.valid_until;

		this.updateValidText();
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

		this.updateValidText();
	}

	checkEnabled()
	{
		this.$scope.offerForm.$setDirty();
	}

	/*
  "offer_currently_visible":"The offer is currently (%s) visible to visitors of NewHere",
  "offer_currently_invisible":"The offer is currently (%s) hidden and not accessible to visitors of NewHere",
	 */

	updateValidText()
	{
		if( !this.offer )
		{
			this.validText = "";
			return;
		}

		//
		let s = Boolean(this.valid_from);
		let e = Boolean(this.valid_until);
		let v = Boolean(this.offer.enabled);

		console.log( s, e, v );

		let result = "";

		//
		if( !s && !e && v )
		{
			result = "offer_valid_nostart_noend_enabled";
		}
		else if( !s && !e && !v )
		{
			result = "offer_valid_nostart_noend_disabled";
		}
		else if( s && e && v )
		{
			result = "offer_valid_start_end_enabled";
		}
		else if( s && e && !v )
		{
			result = "offer_valid_start_end_disabled";
		}
		else if( !s && e && v )
		{
			result = "offer_valid_nostart_end_enabled";
		}
		else if( !s && e && !v )
		{
			result = "offer_valid_nostart_end_disabled";
		}
		else if( s && !e && v )
		{
			result = "offer_valid_start_noend_enabled";
		}
		else if( s && !e && !v )
		{
			result = "offer_valid_start_noend_disabled";
		}

		//
		this.$translate( result ).then( ( msg ) =>
		{
			this.validText = sprintf( msg, {
				from: this.getDateText( this.valid_from ),
				until:this.getDateText( this.valid_until )
			} );
		} );

		//
		if( v )
		{
			let n = new Date().getTime();

			let isS = !this.valid_from || this.valid_from.getTime() < n;
			let isE = !this.valid_until || this.valid_until.getTime() > n;

			if( isS && isE )
			{
				this.isVisible = true;
			}
			else
			{
				this.isVisible = false;
			}
		}
		else
		{
			this.isVisible = false;
		}
	}

	cancel()
	{
		this.$state.go( 'cms.offers' );
	}

	onProviderSelected()
	{
		this.$scope.offerForm.$setDirty();
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

export const OfferFormComponent = {
	template: require( './offer-form.component.html' ),
	controller: OfferFormController,
	controllerAs: 'vm'
};
