export function ProviderDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './provider.directive.html' )
	};
}
