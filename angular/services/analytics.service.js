/**
 * @name AnalyticService
 *
 * may or may not be google, may or may not be allowed (due to cookie consent)
 */
export class AnalyticService
{
	constructor(  )
	{
		'ngInject';

		//
		this.page = null;
		this.title = null;

		this.hasConsent = false;

		// in case consent has been given already (set in index.blade.php)
		if( window.mycc === "allow" )
			this.hasConsent = true;

		// track the current page when consent was given (we still can, but might not miss the landing page)
		// could use a full buffer but ... I guess a buffer of size 1 is enough >_>
		window.onCookieConsent = ( hasConsent ) =>
		{
			this.hasConsent = hasConsent;

			console.log("onCookieConsent",hasConsent);

			if( this.page && this.title )
				this.visitPage( this.page, this.title );
		}
	}

	visitPage( page, title )
	{
		console.log("track-page", Boolean(window.ga), this.hasConsent );

		this.page = page;
		this.title = title;

		if( !Boolean(window.ga) )
			return;

		if( !this.hasConsent )
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

		if( !this.hasConsent )
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

		if( !this.hasConsent )
			return;

		window.ga('send', 'exception', {
			'exDescription': error,
			'exFatal': isFatal
		});
	}

}