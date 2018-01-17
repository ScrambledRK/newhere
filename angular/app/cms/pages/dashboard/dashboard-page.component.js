class DashboardPageController
{
	constructor( $state, UserService )
	{
		'ngInject';

		//
		this.$state = $state;
		this.UserService = UserService;

		//
		this.tab = 0;

		if( this.UserService.isWithoutRole() )
			this.tab = 1;

		if( $state.params.tab )
			this.tab = $state.params.tab;
	}


}

export const DashboardPageComponent = {
	template: require('./dashboard-page.component.html'),
	controller: DashboardPageController,
	controllerAs: 'vm',
	bindings: {}
};