class PageFormController
{
	constructor( SearchService,
				 ToastService,
				 API,
				 $timeout,
				 $document,
				 $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		this.SearchService = SearchService;
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
			images_upload_handler: this._onImageUpload,

			file_picker_types: 'image',
			file_picker_callback: this._onFilePicker
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

	_onFilePicker(callback, value, meta)
	{
		let input = this.$document.createElement( 'input' );
			input.setAttribute('type', 'file');
			input.setAttribute('accept', 'image/*');

		// Note: In modern browsers input[type="file"] is functional without
		// even adding it to the DOM, but that might not be the case in some older
		// or quirky browsers like IE, so you might want to add it to the DOM
		// just in case, and visually hide it. And do not forget do remove it
		// once you do not need it anymore.

		input.onchange = function()
		{
			let file = this.files[0];
			let reader = new FileReader();
				reader.onload = function ()
				{
					// Note: Now we need to register the blob in TinyMCEs image blob
					// registry. In the next release this part hopefully won't be
					// necessary, as we are looking to handle it internally.

					let id = 'blobid' + (new Date()).getTime();
					let blobCache = tinymce.activeEditor.editorUpload.blobCache;
					let base64 = reader.result.split( ',' )[1];
					let blobInfo = blobCache.create( id, file, base64 );

					blobCache.add(blobInfo);

					// call the callback and populate the Title field with the file name
					callback( blobInfo.blobUri(), { title: file.name } );
				};

			reader.readAsDataURL(file);
		};

		input.click();
	}

	/**
	 *
	 * @param blob .blob(), .filename(), ...
	 * @param onSuccess wants the image location as string
	 * @param onError wants an error msg
	 * @private
	 */
	_onImageUpload( blob, onSuccess, onError )
	{
		console.log("upload:");
		console.log(blob);

		onError("not implemented yet man ... give me some space yo");
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
