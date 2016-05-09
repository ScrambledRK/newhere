class LoginFormController {
	constructor($auth, $state, $window, ToastService) {
		'ngInject';

		this.$window = $window;
		this.$auth = $auth;
		this.$state = $state;
		this.ToastService = ToastService;

		this.email = '';
		this.password = '';
	}

	login() {
		var user = {
			email: this.email,
			password: this.password
		};

		this.$auth.login(user)
			.then((response) => {
				var roles = [];
				this.$auth.setToken(response.data);
				angular.forEach(response.data.data.user.roles, function(role){
					roles.push(role.name);
				});
				console.log(roles);
				this.$window.localStorage.roles = JSON.stringify(roles);
				this.ToastService.show('Logged in successfully.');
				this.$state.go('cms.dashboard');
			})
			.catch(this.failedLogin.bind(this));
	}

	failedLogin(response) {
		if (response.status === 422) {
			for (var error in response.data.errors) {
				return this.ToastService.error(response.data.errors[error][0]);
			}
		}
		this.ToastService.error(response.statusText);
	}
}

export const LoginFormComponent = {
	templateUrl: './views/app/components/login-form/login-form.component.html',
	controller: LoginFormController,
	controllerAs: 'vm',
	bindings: {}
}
