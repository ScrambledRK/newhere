export function OfferTitleDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './offer-title.html' )
	};
}
