export function TranslateConfig( $translateProvider )
{
	'ngInject';

	$translateProvider.useStaticFilesLoader( {
		prefix: '/translations/',
		suffix: '.json'
	} );

	//
	$translateProvider.registerAvailableLanguageKeys(
		[
			'ar',
			'de',
			'en',
			'fa',
			'fr'
		],
		{
			'ar_*': 'ar',
			'de_*': 'de',
			'en_*': 'en',
			'fa_*': 'fa',
			'fr_*': 'fr',
			'*': 'en'
		}
	);

	$translateProvider.useMissingTranslationHandler('missingTranslationHandler');
	$translateProvider.useSanitizeValueStrategy( 'sanitize' );

	$translateProvider.preferredLanguage( 'de' );
	$translateProvider.fallbackLanguage( 'en' );
}
