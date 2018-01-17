export function TranslationTypeDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './translation-type.directive.html' )
	};
}
