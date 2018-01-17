export function OfferFiltersDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './offer-filters.directive.html' )
	};
}
