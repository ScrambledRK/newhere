class LanguageMenuController
{
	constructor( LanguageService, $rootScope )
	{
		'ngInject';

		//
		this.LanguageService = LanguageService;

		this.active = $rootScope.language;
		this.languages = [];
	}

	//
	$onInit()
	{
		this.LanguageService.fetchPublished().then( ( list ) =>
		{
			this.languages = list;
		} );
	}

	//
	switchLanguage( language )
	{
		this.LanguageService.changeLanguage( language );
		this.active = language;
	}
}

export const LanguageMenuComponent = {
	template: require('./language-menu.component.html'),
	controller: LanguageMenuController,
	controllerAs: 'vm',
	bindings: {}
};