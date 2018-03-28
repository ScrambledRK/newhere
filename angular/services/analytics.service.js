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
		window.ga('set', 'page', page  );
		window.ga('send', 'pageview');
	}

	changeLanguage( language )
	{
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
		window.ga('send', 'exception', {
			'exDescription': error,
			'exFatal': isFatal
		});
	}

}