/**
 * language switch drop-down
 */
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

		// available languages changed (e.g. overridden by custom-page languages)
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
		if( this.isContent )
		{
			this.$rootScope.$broadcast( 'contentLanguageChanged', language );
			this.active = language;
		}
		else
		{
			this.LanguageService.changeLanguage( language );
			this.active = language;
		}
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
	bindings: {
		isContent:"="
	}
};