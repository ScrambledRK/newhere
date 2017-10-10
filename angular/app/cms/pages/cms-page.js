class CmsPageController
{
	constructor( $mdSidenav, UserService )
	{
		'ngInject';

		//
		this.mdSidenav = $mdSidenav;
		this.UserService = UserService;
	}

	toggleItemsList()
	{
		this.mdSidenav( 'left' ).toggle();
	}

	allowed( role )
	{
		let allowed = false;

		if( this.UserService.roles.indexOf( role ) > -1 )
		{
			allowed = true;
		}

		return allowed;
	}
}

export const CmsPageComponent = {
	template: require( './cms-page.html' ),
	controller: CmsPageController,
	controllerAs: 'vm',
	bindings: {}
}