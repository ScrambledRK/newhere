/**
 * appended to "about-us" custom page;
 * paypalKey injected by build-process via .app.config.json
 */
class PayPalDonateController
{
	constructor( isDonateEnabled, paypalKey )
	{
		'ngInject';

		//
		this.isDonateEnabled = isDonateEnabled;
		this.paypalKey = paypalKey;
	}
}

//
export const PayPalDonateComponent = {
	template: require( './paypal.component.html' ),
	controller: PayPalDonateController,
	controllerAs: 'vm',
	bindings: {	}
};