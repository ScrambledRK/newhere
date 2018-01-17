export function DialDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './dial.directive.html' )
	};
}
