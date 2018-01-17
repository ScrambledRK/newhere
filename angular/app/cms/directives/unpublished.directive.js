export function UnpublishedDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './unpublished.directive.html' )
	};
}
