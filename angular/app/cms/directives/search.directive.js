export function SearchDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './search.directive.html' )
	};
}
