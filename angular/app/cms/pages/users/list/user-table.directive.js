export function UserTableDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './user-table.directive.html' )
	};
}
