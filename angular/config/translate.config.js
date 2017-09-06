export function TranslateConfig($translateProvider) {
    'ngInject';

    $translateProvider.useStaticFilesLoader({
        prefix: '/translations/',
        suffix: '.json'
    });

    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('de');
    $translateProvider.useLocalStorage();
    $translateProvider.useSanitizeValueStrategy('sanitize');
}
