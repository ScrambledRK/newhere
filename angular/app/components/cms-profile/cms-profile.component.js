class CmsProfileController
{
	constructor( UserService, $state, ToastService, $translate )
	{
		'ngInject';

		//
		this.$state = $state;
		this.$translate = $translate;
		this.UserService = UserService;
		this.ToastService = ToastService;

		this.me = null;
		this.UserService.me( ( me ) =>
		{
			this.me = me;
		});
	}

	$onInit()
	{
	}
}

export const CmsProfileComponent = {
	templateUrl: './views/app/components/cms-profile/cms-profile.component.html',
	controller: CmsProfileController,
	controllerAs: 'vm',
	bindings: {}
};