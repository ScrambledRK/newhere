class PageFormController
{
	constructor( ToastService,
	             PageService,
				 API,
				 $timeout,
				 $document,
				 $window,
				 $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		this.ToastService = ToastService;
		this.PageService = PageService;
		this.API = API;

		this.$timeout = $timeout;
		this.$document = $document;
		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$state = $state;

		// ------------------------------ //
		// ------------------------------ //



		// ------------------------------ //
		// ------------------------------ //

		//
		this.page = {
			title:"",
			slug:"",
			content:"",
			enabled:true
		};

		//
		if( $state.params.id )
			this.fetchItem( $state.params.id );

		//
		this.isProcessing = false;

		// ------------------------------- //

		//
		let onLanguage = this.$rootScope.$on( "languageChanged", ( event, data ) =>
		{
			this.onLanguageChanged();
		} );

		this.$scope.$on( '$destroy', () =>
		{
			onLanguage();
		} );
	}



	//
	onLanguageChanged()
	{
		if( this.page.id )
			this.fetchItem( this.page.id );
	}

	//
	fetchItem( id )
	{
		this.API.one( 'cms/pages', id ).get()
			.then( ( item ) =>
				{
					this.setPage( item );
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim laden der Daten.' );
					this.ToastService.error( error );
				}
			);
	}

	//
	save()
	{
		this.isProcessing = true;

		//
		if( !this.page.id )
		{
			this.page.enabled = false;

			this.API.all( 'cms/pages' ).post( this.page )
				.then( ( response ) =>
					{
						this.ToastService.show( 'Eintrag aktualisiert.' );

						this.setPage( response.data.page );
						this.$rootScope.$broadcast( 'role.createPageComplete', this.page );

						this.isProcessing = false;
					},
					( error ) =>
					{
						this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
						this.ToastService.error( error );

						this.isProcessing = false;
					}
				);
		}
		else
		{
			this.API.one( 'cms/pages', this.page.id ).customPUT( this.page )
				.then( ( response ) =>
					{
						this.ToastService.show( 'Eintrag aktualisiert.' );

						this.setPage( response.data.page );
						this.$rootScope.$broadcast( 'role.createPageComplete', this.page );

						this.isProcessing = false;
					},
					( error ) =>
					{
						this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
						this.ToastService.error( error );

						this.isProcessing = false;
					}
				);
		}
	}

	//
	setPage(item)
	{
		//console.log("setPage:", item );

		//
		for(let k in item)
		{
			this.page[k] = item[k];
		}
	}

	toggleItem(isEnabled)
	{
		if( this.page )
		{
			if( this.page.enabled !== isEnabled )
				this.$scope.pageForm.$setDirty();

			this.page.enabled = isEnabled;
		}
	}

	cancel()
	{
		this.$state.go( 'cms.pages' );
	}
}

export const PageFormComponent = {
	template: require( './page-form.component.html' ),
	controller: PageFormController,
	controllerAs: 'vm',
	bindings: {
		buttons: '=buttons'
	}
};
