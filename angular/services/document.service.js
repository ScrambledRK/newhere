/**
 * @name DocumentService
 *
 * updates the document title and keeps track of the current url
 * also triggers the analytics service once both informations (url, title) are up-to-date
 *
 * due to the async nature of the whole thing, several calls to _update are made but only
 * the one with all the info will succeed. invalidating the current data is necessary to
 * allow for click-happy users (see routes.run.js)
 */
export class DocumentService
{
	constructor( $rootScope, $location, AnalyticService )
	{
		'ngInject';

		this.$rootScope = $rootScope;
		this.AnalyticService = AnalyticService;

		//
		this.isDirty = false;
		this.isTranslation = false;

		this.title = null;
		this.url = null;

		//
		let onStateChangeEnd = $rootScope.$on( "$stateChangeSuccess",
			( event, toState, toParams, fromState, fromParams ) =>
			{
				this._update();
			} );

		//
		let onLocationChangeEnd = $rootScope.$on( "$locationChangeSuccess",
			( event, toState, toParams, fromState, fromParams ) =>
			{
				this.url = $location.url();
				this._update();
			} );
	}

	//
	_update()
	{
		if( !this.url || !this.title )
			return;

		this.updateTitle( (title) =>
		{
			console.log("update", this.url, this.title );

			this.AnalyticService.visitPage( this.url, title );
			this.invalidateTitle();
		} );
	}

	//
	invalidateTitle()
	{
		console.log("invalidateTitle", this.title, this.isTranslation, this.isDirty );

		this.url = null;
		this.title = null;
	}

	//
	changeTitle( title, translate )
	{
		if( !title )
			title = "welcome";

		//
		this.isDirty = true;

		this.title = title;
		this.isTranslation = Boolean(translate);

		console.log("changeTitle",  this.title, this.isTranslation, this.isDirty );

		//
		this._update();
	}

	//
	updateTitle( success )
	{
		console.log("updateTitle", this.title, this.isTranslation, this.isDirty );

		if( !this.isDirty )
		{
			success( this.title );
			return;
		}

		//
		if( this.isTranslation )
		{
			this.$translate( this.title ).then( ( msg ) =>
			{
				document.title = "newhere : " + msg;
				success( msg );
			} );
		}
		else
		{
			document.title = "newhere : " + this.title;
			success( this.title );
		}

		//
		this.isTranslation = false;
		this.isDirty = false;
		this.title = "welcome";
	}
}