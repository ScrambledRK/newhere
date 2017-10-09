class CmsPageController
{
	constructor( $mdSidenav, $window )
	{
		'ngInject';

		//
		this.mdSidenav = $mdSidenav;
		this.$window = $window;
	}

	toggleItemsList()
	{
		this.mdSidenav( 'left' ).toggle();
	}

	$onInit()
	{
		this.roles = angular.fromJson( this.$window.localStorage.roles );
	}

	allowed( role )
	{
		let allowed = false;

		if( this.roles.indexOf( role ) > -1 )
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