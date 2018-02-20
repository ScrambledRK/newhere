class PayPalDonateController
{
	constructor(isDonateEnabled,paypalKey)
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