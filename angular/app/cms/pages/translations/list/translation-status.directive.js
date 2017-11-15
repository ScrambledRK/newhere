export function TranslationStatusDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './translation-status.directive.html' )
	};
}
