export function CancelDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './cancel.directive.html' )
	};
}
