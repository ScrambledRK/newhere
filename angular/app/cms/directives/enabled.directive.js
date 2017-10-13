export function EnabledDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './enabled.directive.html' )
	};
}
