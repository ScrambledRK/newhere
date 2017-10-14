class OfferFormController
{
	constructor( $state,
	             API,
	             UserService,
	             ToastService )
	{
		'ngInject';

		this.API = API;
		this.UserService = UserService;
		this.ToastService = ToastService;

		//
		this.providers = this.UserService.providers;

		//
		this.offer = {
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
					this.offer = item;
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim laden der Daten.' );
				}
			);
	}

	save()
	{
		console.log("save:", this.offer );

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

	updateItem()
	{
		this.API.one( 'cms/offers', this.offer .id ).customPUT( this.offer )
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

	createItem()
	{
		this.API.all( 'cms/offers' ).post( this.offer )
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
}

export const OfferFormComponent = {
	template: require('./offer-form.component.html'),
	controller: OfferFormController,
	controllerAs: 'vm'
};
