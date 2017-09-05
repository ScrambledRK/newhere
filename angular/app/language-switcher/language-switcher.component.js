class AppLanguageSwitcherController
{
	constructor( LanguageService, $state, $rootScope )
	{
		'ngInject';
		this.LanguageService = LanguageService;
		this.LanguageService.fetchPublished( ( publishedLanguages ) =>
		{
			this.languages = publishedLanguages;
		} );
		this.$state = $state;
		this.$rootScope = $rootScope;
	}

	$onInit()
	{
	}

	switchLanguage( language )
	{
		var vm = this;
		this.LanguageService.changeLanguage( language, function()
		{
			vm.$rootScope.$broadcast( 'languageChanged' );
		} );
	}
}

export const AppLanguageSwitcherComponent = {
	templateUrl: './views/app/language-switcher/language-switcher.component.html',
	controller: AppLanguageSwitcherController,
	controllerAs: 'vm',
	bindings: {}
}