class LanguageMenuController
{
	constructor( LanguageService, $rootScope, $scope )
	{
		'ngInject';

		//
		this.LanguageService = LanguageService;
		this.$rootScope = $rootScope;

		//
		this.active = this.$rootScope.language;
		this.languages = this.LanguageService.fetchPublished();

		//
		let onLanguage = $rootScope.$on( "checkLanguage", ( event, data ) =>
		{
			this.checkLanguage( )
		} );

		$scope.$on( '$destroy', () =>
		{
			onLanguage();
		} );
	}

	//
	switchLanguage( language )
	{
		this.LanguageService.changeLanguage( language );
	}

	//
	checkLanguage( )
	{
		if( this.LanguageService.isActive( this.$rootScope.language ) )
		{
			this.active = this.$rootScope.language;
		}
		else
		{
			this.active = "de";
		}
	}
}

export const LanguageMenuComponent = {
	template: require('./language-menu.component.html'),
	controller: LanguageMenuController,
	controllerAs: 'vm',
	bindings: {}
};