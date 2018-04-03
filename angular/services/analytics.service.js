/**
 * @name ToastService
 */
export class AnalyticService
{
	constructor(  )
	{
		'ngInject';

		//
		this.page = null;
		this.title = null;

		// track the current page when consent was given (we still can, but might not miss the landing page)
		window.onCookieConsent = ( hasConsent ) =>
		{
			//
			if( this.page && this.title )
				this.visitPage( this.page, this.title );
		}
	}

	visitPage( page, title )
	{
		this.page = page;
		this.title = title;

		if( !window.ga )
			return;

		window.ga('set', 'page', page  );
		window.ga('send', 'pageview');

		this.page = null;
		this.title = null;
	}

	changeLanguage( language )
	{
		if( !window.ga )
			return;

		//
		window.ga('send', {
			hitType: 'event',
			eventCategory: 'language',
			eventAction: 'change-language',
			eventLabel: language
		});
	}

	exception( error, isFatal )
	{
		if( !window.ga )
			return;

		window.ga('send', 'exception', {
			'exDescription': error,
			'exFatal': isFatal
		});
	}

}