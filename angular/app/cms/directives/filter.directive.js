export function FilterDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './filter.directive.html' )
	};
}
