class OfferListController
{
	constructor( $sessionStorage, $rootScope, API )
	{
		'ngInject';

		//
		let vm = this;

		//
		this.$sessionStorage = $sessionStorage;
		this.$rootScope = $rootScope;
		this.API = API;

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

			vm.promise = this.API.all( 'offers' ).getList( vm.query )
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
}

export const OfferListComponent = {
	template: require( './offer-list.component.html' ),
	controller: OfferListController,
	controllerAs: 'vm'
};
