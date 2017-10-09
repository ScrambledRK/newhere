export function OfferTableDirective() {
	'ngInject';

	return {
		scope: false,
		restrict: 'E',
		template: require( './offer-table.directive.html' )
	};
}
