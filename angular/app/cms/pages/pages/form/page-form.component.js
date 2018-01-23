class PageFormController
{
	constructor( SearchService,
				 ToastService,
				 API,
				 $timeout,
				 $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		this.SearchService = SearchService;
		this.ToastService = ToastService;
		this.API = API;

		this.$timeout = $timeout;
		this.$rootScope = $rootScope;
		this.$scope = $scope;

		//
		this.page = {
			title:"",
			slug:"",
			content:"",
			enabled:false
		};

		//
		if( $state.params.id )
			this.fetchItem( $state.params.id );

		//
		this.isProcessing = false;
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
						this.ToastService.show( 'Erfolgreich gespeichert.' );
						console.log( "res:", response.data.page );

						this.setPage( response.data.page );
						this.$rootScope.$broadcast( 'role.createPageComplete', this.page );

						this.isProcessing = false;
					},
					( error ) =>
					{
						this.ToastService.error( 'Fehler beim Speichern der Daten.' );
						this.isProcessing = false;
					}
				);
		}
		else
		{
			this.API.one( 'cms/pages', this.page.id ).customPUT( this.page )
				.then( ( response ) =>
					{
						this.ToastService.show( 'Erfolgreich gespeichert.' );
						console.log( "res:", response.data.page );

						this.setPage( response.data.page );
						this.$rootScope.$broadcast( 'role.createPageComplete', this.page );

						this.isProcessing = false;
					},
					( error ) =>
					{
						this.ToastService.error( 'Fehler beim Speichern der Daten.' );
						this.isProcessing = false;
					}
				);
		}
	}

	//
	setPage(item)
	{
		console.log("setPage:", item );

		//
		for(let k in item)
		{
			this.page[k] = item[k];
		}
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
