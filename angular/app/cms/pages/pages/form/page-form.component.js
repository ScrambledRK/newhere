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

		//
		this.PageService.all().then( () =>
		{
			let tiny_linklist = [];

			//
			for( let i = 0; i < this.PageService.pages.length; i++ )
			{
				let page = this.PageService.pages[i];

				//
				tiny_linklist[i] = {
					title: page.title,
					value: '#!/page/' + page.slug
				}
			}

			this._setupTinyMCE( $window, tiny_linklist );
		});

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
	_setupTinyMCE( $window, linklist )
	{
		console.log("setup tinymce");

		//
		this.options = {

			plugins: 'link autolink code image',
			toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
			content_css: $window.newhere.css,

			link_list: linklist,
			link_class_list: [
				{title: 'default', value: ''},
				{title: 'download', value: 'btn-download'}
			],

			init_instance_callback : (editor) =>
			{
				console.log("init instance callback:", editor);

				this.tinymceEditor = editor;
				//this._setLinkList();
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

						let window = this.tinymceEditor.windowManager.getWindows()[0];
							window.hide();  // disabled() doesn't do anything, so hide instead

						let notification = this.tinymceEditor.notificationManager.open({
							text: 'uploading file',
							type: 'info',
							progressBar: true,
							closeButton: false,
						});

						this.API.all( 'cms/pages/upload' ).post( payload )
							.then( ( response ) =>
								{
									this.ToastService.show( 'Eintrag aktualisiert.' );

									this.tinymceEditor.notificationManager.close();
									this.isProcessing = false;

									window.show();

									callback( response.location, { alt: file.name } );
								},
								( error ) =>
								{
									this.tinymceEditor.notificationManager.close();
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
