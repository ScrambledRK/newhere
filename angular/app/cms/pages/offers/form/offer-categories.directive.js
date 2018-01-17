export function OfferCategoriesDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './offer-categories.directive.html' )
	};
}
