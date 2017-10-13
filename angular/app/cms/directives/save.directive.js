export function SaveDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './save.directive.html' )
	};
}
