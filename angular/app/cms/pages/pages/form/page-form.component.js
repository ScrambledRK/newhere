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

		// ------------------------------ //
		// ------------------------------ //

		//
		this.options = {

			plugins: 'link autolink code image',
			toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',

			setup : (editor) =>
			{
				this.tinymce = editor;
			},

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

				//
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
						//console.log( payload );

						let window = this.tinymce.windowManager.getWindows()[0];
							window.hide();  // disabled() doesn't do anything, so hide instead

						let notification = this.tinymce.notificationManager.open({
							text: 'uploading file',
							type: 'info',
							progressBar: true,
							closeButton: false,
						});

						this.API.all( 'cms/pages/upload' ).post( payload )
							.then( ( response ) =>
								{
									this.ToastService.show( 'Eintrag aktualisiert.' );

									this.tinymce.notificationManager.close();
									this.isProcessing = false;

									window.show();

									callback( response.location, { alt: file.name } );
								},
								( error ) =>
								{
									this.tinymce.notificationManager.close();
									this.isProcessing = false;

									window.show();

									this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );
								}
							);


					};

					reader.readAsDataURL(file);
					this.isProcessing = true;
				};

				input.click();
			}
		};

		// ------------------------------ //
		// ------------------------------ //

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
}

export const PageFormComponent = {
	template: require( './page-form.component.html' ),
	controller: PageFormController,
	controllerAs: 'vm',
	bindings: {
		buttons: '=buttons'
	}
};
