export function ProviderTasksTableDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './provider-tasks-table.directive.html' )
	};
}
