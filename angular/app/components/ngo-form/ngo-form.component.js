class NgoFormController
{
	constructor( $auth,
	             NgoService,
	             ToastService,
	             $state,
	             $translate,
	             LanguageService,
	             SearchService,
	             $rootScope	)
	{
		'ngInject';


		angular.element( document.querySelector( '#addressSearch' ) ).$valid = false;

		this.cms = $rootScope.cms;

		this.$auth = $auth;
		this.NgoService = NgoService;
		this.ToastService = ToastService;
		this.SearchService = SearchService;
		this.$state = $state;
		this.$translate = $translate;
		this.$LanguageService = LanguageService;
	}

	querySearch( query )
	{
		return this.SearchService.searchAddress( query );
	}

	selectedItemChange( item )
	{
		if( !item ) return;
		if( !this.ngo )
		{
			this.ngo = {};
		}
		this.ngo.street = item.street;
		this.ngo.street_number = item.number;
		this.ngo.city = item.city;
		this.ngo.zip = item.zip;
	}

	register()
	{
		this.ngo.language = this.$LanguageService.activeLanguage();

		if( this.ngo.editMode )
		{
			this.NgoService.update( this.ngo );
		}
		else
		{
			if( !this.cms )
			{
				this.$auth.signup( this.ngo )
				.then( ( response ) =>
				{
					//remove this if you require email verification
					//this.$auth.setToken(response.data);
					this.$translate( 'Registrierung erfolgreich.' ).then( ( msg ) =>
					{
						this.ToastService.show( msg );
					} );
					this.$state.go( 'app.login' );
				} )
				.catch( this.failedRegistration.bind( this ) );
			}
			else
			{
				this.NgoService.create( this.ngo );
			}
		}
	}

	cancel()
	{
		this.NgoService.cancel( this.cms );
	}

	failedRegistration( response )
	{
		if( response.status === 422 )
		{
			for( var error in response.data.errors )
			{
				return this.ToastService.error( response.data.errors[error][0] );
			}
		}
		this.ToastService.error( response.statusText );
	}

}

export const NgoFormComponent = {
	templateUrl: './views/app/components/ngo-form/ngo-form.component.html',
	controller: NgoFormController,
	controllerAs: 'vm',
	bindings: {
		cms: '=',
		ngo: '='
	}
}
