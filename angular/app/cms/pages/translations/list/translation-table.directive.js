export function TranslationTableDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './translation-table.directive.html' )
	};
}
