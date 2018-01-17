export function OfferDetailsDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './offer-details.directive.html' )
	};
}
