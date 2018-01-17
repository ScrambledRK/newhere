export function TranslationLanguageDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './translation-lang.directive.html' )
	};
}
