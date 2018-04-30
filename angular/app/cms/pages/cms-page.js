class CmsPageController
{
	constructor( $mdSidenav, UserService, LanguageService, $scope )
	{
		'ngInject';

		//
		this.mdSidenav = $mdSidenav;
		this.UserService = UserService;
		this.LanguageService = LanguageService;
		this.$scope = $scope;


	}

	$onInit()
	{
		this.LanguageService.overrideLanguages([{locale:"en"},{locale:"de"}]);

		this.$scope.$on( '$destroy', () =>
		{
			this.LanguageService.overrideLanguages( null );
		} );
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