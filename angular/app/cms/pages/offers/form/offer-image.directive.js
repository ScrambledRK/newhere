export function OfferImageDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './offer-image.directive.html' )
	};
}
