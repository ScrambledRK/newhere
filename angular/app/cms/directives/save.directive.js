export function SaveDirective()
{
	'ngInject';

	return {
		scope: {
			isDisabled: '=' //use 2-way binding instead.
		},
		restrict: 'E',
		template: require( './save.directive.html' )
	};
}
