class OfferListController
{
	constructor( $sessionStorage,
	             $rootScope,
	             API,
	             UserService,
	             ToastService )
	{
		'ngInject';

		//
		let vm = this;

		//
		this.$sessionStorage = $sessionStorage;
		this.$rootScope = $rootScope;
		this.API = API;
		this.UserService = UserService;
		this.ToastService = ToastService;

		//
		this.providers = this.UserService.providers;
		this.selectedItems = [];
		this.loading = true;

		//
		this.promise = null;
		this.items = null;
		this.numItems = 0;

		//
		this.query =
			{
				order: '-id',
				limit: 10,
				page: 1
			};

		// --------------- //

		/**
		 * not a "member" method because of stupid bug where "this" reference is lost
		 */
		this.onQueryUpdate = () =>
		{
			console.log( "q", vm.query );

			vm.promise = this.API.all( 'cms/offers' ).getList( vm.query )
				.then( ( response ) =>
				{
					vm.items = response;
					vm.numItems = response.count;
					vm.loading = false;
				} )
			;
		};

		this.onQueryUpdate();
	}

	//
	toggleEnabled( item )
	{
		this.API.one( 'cms/offers', item.id ).customPUT( item )
			.then( ( success ) =>
				{
					this.ToastService.show( 'Angebot aktualisiert.' );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim Speichern der Daten.' );
					item.enabled = !item.enabled;
				}
			);
	}

	//
	isElementVisible( name )
	{
		if( name === "provider" )
		{
			if( this.UserService.providers.length <= 1 )
				return false;
		}

		if( name === "create" )
		{
			if( this.UserService.isModerator() )
				return false;
		}

		return true;
	}

	isElementEnabled( name )
	{
		if( name === "enabled" )
		{
			if( this.UserService.isAdministrator() )
				return false;
		}

		return true;
	}
}

export const OfferListComponent = {
	template: require( './offer-list.component.html' ),
	controller: OfferListController,
	controllerAs: 'vm'
};
