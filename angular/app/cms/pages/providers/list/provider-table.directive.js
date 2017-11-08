export function ProviderTableDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './provider-table.directive.html' )
	};
}
