class OfferListController
{
	constructor( $sessionStorage, $rootScope, API, UserService )
	{
		'ngInject';

		//
		let vm = this;

		//
		this.$sessionStorage = $sessionStorage;
		this.$rootScope = $rootScope;
		this.API = API;
		this.UserService = UserService;

		//
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
			console.log("q", vm.query );

			vm.promise = this.API.all( 'cms/offers' ).getList( vm.query )
				.then( (response) =>
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
	isColumnVisible( name )
	{
		if(name === "provider")
		{
			if( this.UserService.providers.length <= 1 )
				return false;
		}

		return true;
	}

	isColumnEnabled( name )
	{
		if(name === "enabled")
			return this.UserService.isNgoUser();

		return true;
	}
}

export const OfferListComponent = {
	template: require( './offer-list.component.html' ),
	controller: OfferListController,
	controllerAs: 'vm'
};
