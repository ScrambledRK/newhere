class PageFormController
{
	constructor( ToastService,
				 API,
				 $timeout,
				 $document,
				 $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		this.ToastService = ToastService;
		this.API = API;

		this.$timeout = $timeout;
		this.$document = $document;
		this.$rootScope = $rootScope;
		this.$scope = $scope;

		//
		this.options = {
			plugins: 'link autolink code image',
			toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',

			file_picker_types: 'image file',
			file_picker_callback: (callback, value, meta) =>
			{
				let input = document.createElement( 'input' );

				if (meta.filetype === 'image')
				{
					input.setAttribute( 'type', 'file' );
					input.setAttribute( 'accept', 'image/*' );
				}
				else if (meta.filetype === 'file')
				{
					input.setAttribute( 'type', 'file' );
					input.setAttribute( 'accept', 'image/*,application/pdf' );
				}

				// Note: In modern browsers input[type="file"] is functional without
				// even adding it to the DOM, but that might not be the case in some older
				// or quirky browsers like IE, so you might want to add it to the DOM
				// just in case, and visually hide it. And do not forget do remove it
				// once you do not need it anymore.

				console.log( this.page );

				input.onchange = () =>
				{
					let file = input.files[0];
					let reader = new FileReader();

					reader.onload = () =>
					{
						let id = 'blobid' + (new Date()).getTime();
						let base64 = reader.result.split( ',' )[1];

						let blobCache = tinymce.activeEditor.editorUpload.blobCache;
						let blobInfo = blobCache.create( id, file, base64 );

						blobCache.add(blobInfo);

						//
						let payload = {
							type : file.type,
							name : file.name,
							size : file.size,
							data : base64
						};

						//
						console.log( payload );

						this.API.all( 'cms/pages/upload' ).post( payload )
							.then( ( response ) =>
								{
									this.ToastService.show( 'Erfolgreich gespeichert.' );

									console.log( "res:", response.location );
									callback( response.location, { alt: file.name } );
								},
								( error ) =>
								{
									this.ToastService.error( 'Fehler beim Speichern der Daten.' );
								}
							);


					};

					reader.readAsDataURL(file);
				};

				input.click();
			}
		};

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
