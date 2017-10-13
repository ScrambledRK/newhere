export function OfferTranslationDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './offer-translation.directive.html' )
	};
}
