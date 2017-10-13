export function CreateDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './create.directive.html' )
	};
}
