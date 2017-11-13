class TranslationListController
{
	constructor( $sessionStorage,
	             $rootScope,
	             $state,
	             $q,
	             API,
	             UserService,
	             ToastService,
	             DialogService,
	             TranslationService )
	{
		'ngInject';

		//
		let vm = this;

		//
		this.$sessionStorage = $sessionStorage;
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$q = $q;

		this.API = API;
		this.UserService = UserService;
		this.ToastService = ToastService;
		this.DialogService = DialogService;
		this.TranslationService = TranslationService;

		//
		this.languages = this.TranslationService.languages;

		//
		this.selectedItems = [];
		this.loading = true;

		//
		this.promise = null;

		this.items = this.TranslationService.translations;
		this.numItems = this.TranslationService.numItems;

		//
		this.query =
			{
				order: '-id',
				limit: 10,
				page: 1
			};

		// pre-filter
		if( this.$state.params.ngo )
		{
			//
		}

		// --------------- //
		// --------------- //

		/**
		 * not a "member" method because of stupid bug where "this" reference is lost
		 * this issue is specific to material design components
		 */
		this.onQueryUpdate = () =>
		{
			this.selectedItems = [];

			vm.promise = this.TranslationService.fetchList( "offers", vm.query )
				.then( () =>
				{
					vm.loading = false;
					vm.promise = null;

					vm.numItems = vm.TranslationService.numItems;
				} )
			;
		};

		this.onQueryUpdate();
	}

	// --------------------------------------- //
	// --------------------------------------- //

	//
	isElementVisible( name )
	{
		return true;
	}

	//
	isElementEnabled( name )
	{
		return false;
	}
}

export const TranslationListComponent = {
	template: require( './translation-list.component.html' ),
	controller: TranslationListController,
	controllerAs: 'vm'
};
