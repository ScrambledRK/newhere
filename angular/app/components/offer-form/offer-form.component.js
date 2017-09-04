class OfferFormController
{
	constructor( OfferService,
	             ToastService,
	             NgoService,
	             CategoryService,
	             $state,
	             $translate,
	             LanguageService,
	             SearchService,
	             OfferTranslationService,
	             $rootScope )
	{
		'ngInject';

		this.cms = $rootScope.cms;

		var vm = this;

		this.categories = [];
		this.translations = [];
		this.untranslatedOffers = [];
		this.defaultLanguage = {};

		this.OfferService = OfferService;
		this.ToastService = ToastService;
		this.SearchService = SearchService;
		this.$state = $state;
		this.$translate = $translate;

		//
		this.LanguageService = LanguageService;
		this.LanguageService.fetchDefault( ( defaultLanguage ) =>
		{
			this.defaultLanguage = defaultLanguage;
		} );
		this.LanguageService.fetchEnabled( ( enabledLanguages ) =>
		{
			this.enabledLanguages = enabledLanguages;
		} );

		//
		this.OfferTranslationService = OfferTranslationService;
		this.OfferTranslationService.fetchAll( ( list ) =>
		{
			this.translations = list;
		} );
		this.OfferTranslationService.fetchUntranslated( ( untranslatedOffers ) =>
		{
			this.untranslatedOffers = untranslatedOffers;
		} );

		//
		this.NgoService = NgoService;

		//
		if( this.cms )
		{
			this.NgoService.fetchAll().then( ( list ) =>
			{
				this.ngos = list;
			} );
		}

		//
		this.CategoryService = CategoryService;
		this.CategoryService.all( ( list ) =>
		{
			this.categories = list;
		} );


		this.categoriesOptions = {
			selectionChanged: ( items ) =>
			{
				this.offer.categories = items;
			}
		};

		//
		if( $state.params.id )
		{
			this.OfferService.one( $state.params.id, ( offer ) =>
			{
				this.offer = offer;
				if( this.offer.valid_from != null )
				{
					this.valid_from = new Date( this.offer.valid_from );
				}
				if( this.offer.valid_until != null )
				{
					this.valid_until = new Date( this.offer.valid_until );
				}
				if( !this.offer.street )
				{
					this.offer.withoutAddress = true;
				}
			} )
		}
		else
		{
			this.offer = {
				categories: [],
				filters: [],
				translations: []
			};
			this.valid_from = new Date();
			this.NgoService.one().then( ( ngo ) =>
			{
				this.adoptFieldsFromNgo( ngo );
			} );
		}

		angular.element( document.querySelector( '#addressSearch' ) ).$valid = false;
	}

	querySearch( query )
	{
		return this.SearchService.searchAddress( query );
	}

	selectedItemChange( item )
	{
		if( !item ) return;
		this.offer.street = item.street;
		this.offer.streetnumber = item.number;
		this.offer.city = item.city;
		this.offer.zip = item.zip;
	}

	save()
	{
		if( this.offer.withoutAddress )
		{
			this.offer.street = null;
			this.offer.streetnumber = null;
			this.offer.zip = null;
			this.offer.city = null;
		}

		this.offer.valid_until = this.valid_until;
		this.offer.valid_from = this.valid_from;
		if( new Date() > this.offer.valid_until )
		{
			this.$translate( 'Enddatum liegt in der Vergangenheit!' ).then( ( msg ) =>
			{
				this.ToastService.error( msg );
			} );
			return false;
		}

		this.OfferService.save( this.offer );

	}

	cancel()
	{
		this.OfferService.cancel( this.cms );
	}

	adoptFieldsFromNgo( ngo )
	{
		if( ngo )
		{
			this.offer.email = ngo.contact_email;
			this.offer.phone = ngo.contact_phone;
			this.offer.website = ngo.website;
			this.offer.street = ngo.street;
			this.offer.streetnumber = ngo.street_number;
			this.offer.zip = ngo.zip;
			this.offer.city = ngo.city;
		}
	}


}

export const OfferFormComponent = {
	templateUrl: './views/app/components/offer-form/offer-form.component.html',
	controller: OfferFormController,
	controllerAs: 'vm',
	bindings: {
		cms: '=',
		ngo: '='
	}
}
