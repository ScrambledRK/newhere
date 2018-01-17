export function OfferDateDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './offer-date.directive.html' )
	};
}
