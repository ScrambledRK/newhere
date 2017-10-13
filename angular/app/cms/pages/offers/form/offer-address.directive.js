export function OfferAddressDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './offer-address.directive.html' )
	};
}
