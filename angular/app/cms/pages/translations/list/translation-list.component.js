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
		this.enabledLanguages = this.TranslationService.enabledLanguages;
		this.isTranslateOnSave = this.TranslationService.isTranslateOnSave;

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
				type: 'offer',
				order: 'updated_at',
				limit: 10,
				page: 1
			};

		// pre-filter
		if( this.$state.params.type )
		{
			this.query.type = this.$state.params.type;
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

			vm.promise = this.TranslationService.fetchList( vm.query.type, vm.query )
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
	editItem( item )
	{
		console.log( "dialog:", item );

		let source = item.translations["de"];
		let target = item.translations["en"];


		for( let s in item.translations )
		{
			if( !item.translations.hasOwnProperty(s) )
				continue;

			if( item.translations[s].version === 2 )
			{
				source = item.translations[s];
				break;
			}
		}

		for( let t in item.translations )
		{
			if( !item.translations.hasOwnProperty(t) )
				continue;

			if( item.translations[t].version === 0 )
			{
				target = item.translations[t];
				break;
			}
		}

		//
		if( this.dialog )
		{
			source = item.translations[this.dialog.source.locale];
			target = item.translations[this.dialog.target.locale];
		}

		//
		if( this.query.type === "page" )
		{
			for( let t in item.translations )
			{
				if( !item.translations.hasOwnProperty(t) )
					continue;

				//
				let trgt = item.translations[t];

				if( trgt.version !== 0 || trgt === source )
					continue;

				if( source.content && (!trgt.content || trgt.content.length === 0) )
					trgt.content = source.content;
			}
		}

		//
		this.dialog = {
			title: item.title,
			languages: item.translations,
			source: source,
			target: target
		};

		//
		this.DialogService.fromTemplate( 'translation', {
			controller: () => this,
			controllerAs: 'vm'
		} );
	}

	cancel()
	{
		//console.log("cancel");
		this.DialogService.hide();
	}

	save()
	{
		if( this.isTranslateOnSave )
		{
			if( this.dialog.target.version === 0 )
				this.dialog.target.version = 1;
		}

		this.TranslationService.updateList( [this.dialog.target], this.query.type );
		this.DialogService.hide();
	}

	// --------------------------------------- //
	// --------------------------------------- //

	//
	onSelectedLanguagesChanged()
	{

	}

	setTranslateOnSave()
	{
		this.TranslationService.isTranslateOnSave = this.isTranslateOnSave;
		console.log( this.isTranslateOnSave );
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
