export function CategoryTitleDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './category-title.html' )
	};
}
