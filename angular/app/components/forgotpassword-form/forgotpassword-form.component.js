class ForgotpasswordFormController {
    constructor(UserService, $state, ToastService, $translate) {
        'ngInject';

        //
        this.email = "";
        this.$state = $state;
        this.$translate = $translate;
        this.UserService = UserService;
        this.ToastService = ToastService;
        this.sending = false;
    }
    resetPassword() {
        this.sending = true;
        this.UserService.forgotpassword(this.email, () => {
            this.sending = false;
            this.$state.go('app.login');
        });
    }

    $onInit() {}
}

export const ForgotpasswordFormComponent = {
    templateUrl: './views/app/components/forgotpassword-form/forgotpassword-form.component.html',
    controller: ForgotpasswordFormController,
    controllerAs: 'vm',
    bindings: {}
};