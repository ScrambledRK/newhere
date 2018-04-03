/**
 * @name ToastService
 */
export class AnalyticService
{
	constructor(  )
	{
		'ngInject';


	}

	visitPage( page )
	{
		if( !window.ga )
			return;

		window.ga('set', 'page', page  );
		window.ga('send', 'pageview');
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