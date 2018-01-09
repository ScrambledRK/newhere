class ForgotpasswordFormController
{
	constructor( UserService, $state, ToastService, $translate )
	{
		'ngInject';

		this.$state = $state;
		this.$translate = $translate;
		this.UserService = UserService;
		this.ToastService = ToastService;

		//
		this.email = "";
		this.sending = false;
	}

	//
	resetPassword()
	{
		this.sending = true;
		this.UserService.requestNewPassword( this.email ).then( (response) =>
		{
			this.sending = false;
			this.$state.go( 'app.login' );
			this.ToastService.show( 'Klicke auf den Link in der Email, die wir dir soeben gesendet haben!' );
		} );
	}

	$onInit()
	{
	}
}

export const ForgotpasswordFormComponent = {
	template: require('./forgotpassword-form.component.html'),
	controller: ForgotpasswordFormController,
	controllerAs: 'vm',
	bindings: {}
};