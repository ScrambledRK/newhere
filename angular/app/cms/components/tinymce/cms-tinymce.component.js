class TinyMceController
{
	constructor( API,
				 PageService,
				 ToastService,
				 $window )
	{
		'ngInject';

		//
		this.PageService = PageService;
		this.ToastService = ToastService;
		this.API = API;

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
	}

	//
	_setupTinyMCE( $window, linklist )
	{
		//console.log("setup tinymce");

		if( !this.isAdmin )
		{
			this.options = {
				plugins: 'link autolink code lists preview',
				toolbar: 'undo redo | bold italic | numlist bullist | alignleft aligncenter alignright | code',
				content_css: $window.newhere.css,
				body_class: 'custom-page-content',
				branding: false,
				height : "480",

				link_list: linklist,
				link_class_list: [
					{title: 'default', value: ''},
					{title: 'download', value: 'btn-download'}
				],
			};

			return;
		}

		//
		this.options = {

			plugins: 'link autolink code image lists preview',
			toolbar: 'undo redo | bold italic | numlist bullist | alignleft aligncenter alignright | code',
			content_css: $window.newhere.css,
			body_class: 'custom-page-content',
			branding: false,
			height : "680",

			link_list: linklist,
			link_class_list: [
				{title: 'default', value: ''},
				{title: 'download', value: 'btn-download'}
			],

			init_instance_callback : (editor) =>
			{
				//console.log("init instance callback:", editor);
				this.tinymceEditor = editor;
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
}

export const TinyMceComponent = {
	template: require('./cms-tinymce.component.html'),
	controller: TinyMceController,
	controllerAs: 'vm',
	bindings: {
		model: '=ngModel',
		isAdmin: '=isAdmin'
	}
};