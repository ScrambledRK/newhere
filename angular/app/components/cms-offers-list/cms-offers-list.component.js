class CmsOffersListController
{
	constructor( API,
				 OfferService,
	             NgoService,
	             DialogService,
	             UserService,
	             $sessionStorage,
	             $filter,
	             $state,
	             $translate )
	{
		'ngInject';

		var vm = this;

		vm.menu = {
			isOpen: false
		};

		vm.loading = true;
		vm.isNgoPublished = false;

		//
		this.$sessionStorage = $sessionStorage;
		this.$filter = $filter;
		this.$state = $state;
		this.$translate = $translate;

		//
		this.API = API;
		this.DialogService = DialogService;
		this.NgoService = NgoService;
		this.OfferService = OfferService;
		this.UserService = UserService;

		// --------------------- //

		this.selectedOffers = [];
		this.listOrderByColumn = '-organisation';

		this.search = {
			show: false,
			query: ''
		};

		this.query = {
			order: '-id',
			limit: 10,
			page: 1
		};

		//
		if( this.$sessionStorage.offerQuery )
			this.query = this.$sessionStorage.offerQuery;

		vm.$sessionStorage.offerQuery = this.query;
	}

	/**
	 *
	 */
	$onInit()
	{
		this.promise = this.API.one( 'users', 'me' ).get()
		.then(
			( user ) =>
			{
				this.query.user_id = user.id;
				return this.API.all( 'offers' ).getList( this.query );
			}
		).then(
			( response ) =>
			{
				this.loading = false;
				this.offers = response;
				this.count = response.count;
			}
		)
	}

	/**
	 *
	 */
	toggleEnabled( offer )
	{
		this.OfferService.toggleEnabled( offer );
	}

	/**
	 *
	 */
	bulkToggleEnabled( enabled )
	{
		this.OfferService.bulkAssign( this.selectedOffers, 'enabled', enabled, ( list ) =>
		{
			angular.forEach( list, ( item ) =>
			{
				angular.forEach( this.offers, ( offer, key ) =>
				{
					if( offer.id === item.id )
					{
						offer.enabled = enabled;
					}
				} );
			} );
			this.selectedOffers = [];
			this.DialogService.hide();
		} );
	}

	/**
	 *
	 */
	remove()
	{
		//@todo translation!!!
		this.DialogService.prompt( 'Deleting Offers?', 'You are about to delete offer(s). Type in DELETE and confirm?', 'Delete Secret' ).then( ( response ) =>
		{
			if( response === "DELETE" )
			{
				this.OfferService.bulkRemove( this.selectedOffers, ( list ) =>
				{
					this.selectedOffers = [];
					angular.forEach( list, ( item ) =>
					{
						angular.forEach( this.offers, ( offer, key ) =>
						{
							if( offer.id === item.id )
							{
								this.offers.splice( key, 1 );
							}
						} );
					} );
				} );
			}
			else
			{
				this.DialogService.alert( 'Not correct', 'Thankfully, you entered the wrong secret. So nothing is going to change... for now.' );
			}
		} );
	}

	/**
	 *
	 */
	updateNgo( offer )
	{
		this.OfferService.save( offer );
	}

	/**
	 *
	 */
	assignNgo()
	{
		if( !this.ngos )
		{
			this.NgoService.fetchAll().then( ( response ) =>
			{
				this.ngos = response;
			} );
		}

		this.DialogService.fromTemplate( 'assignToNgo', {
			controller: () => this,
			controllerAs: 'vm'
		} );
	}

	/**
	 *
	 */
	assignSave()
	{
		this.OfferService.bulkAssign( this.selectedOffers, 'ngo_id', this.ngo.id, ( list ) =>
		{
			angular.forEach( list, ( item ) =>
			{
				angular.forEach( this.offers, ( offer, key ) =>
				{
					if( offer.id === item.id )
					{
						offer.ngo_id = this.ngo.id;
					}
				} );
			} );
			this.selectedOffers = [];
			this.DialogService.hide();
		} );
	}

	cancel()
	{
		this.DialogService.hide();
	}

}

export const CmsOffersListComponent = {
	templateUrl: './views/app/components/cms-offers-list/cms-offers-list.component.html',
	controller: CmsOffersListController,
	controllerAs: 'vm',
	bindings: {
		cms: '='
	}
}
