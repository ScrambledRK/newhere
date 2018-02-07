class PayPalDonateController
{
	constructor()
	{
		'ngInject';
		//
	}
}

//
export const PayPalDonateComponent = {
	template: require( './paypal.component.html' ),
	controller: PayPalDonateController,
	controllerAs: 'vm',
	bindings: {	}
};