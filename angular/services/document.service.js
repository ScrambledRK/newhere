/**
 * @name DocumentService
 */
export class DocumentService
{
	constructor( )
	{
		'ngInject';

		this.isDirty = false;
		this.onComplete = (title) => {};
	}

	//
	changeTitle( title, translate )
	{
		document.title = "newhere : " + title;

		//
		this.isDirty = true;

		if( translate )
		{
			this.$translate( title ).then( ( msg ) =>
			{
				document.title = "newhere : " + msg;

				this.isDirty = false;
				this.onComplete( document.title );
			} );
		}
		else
		{
			this.isDirty = false;
			this.onComplete( document.title );
		}
	}
}