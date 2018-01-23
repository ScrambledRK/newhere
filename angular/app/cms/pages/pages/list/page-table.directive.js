export function PageTableDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './page-table.directive.html' )
	};
}
