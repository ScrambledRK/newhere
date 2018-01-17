export function PaginationDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './pagination.directive.html' )
	};
}
