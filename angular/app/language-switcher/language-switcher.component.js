class AppLanguageSwitcherController
{
	/**
	 * @param {LanguageService} LanguageService
	 * @param {*} $rootScope
	 */
	constructor( LanguageService,
	             $rootScope )
	{
		'ngInject';

		let vm = this;

		this.$rootScope = $rootScope;
		this.LanguageService = LanguageService;

		this.languages = [];
	}

	//
	$onInit()
	{
		this.LanguageService.fetchPublished().then( (list) =>
		{
			this.languages = list;
		});
	}

	//
	switchLanguage( language )
	{
		this.LanguageService.changeLanguage( language );
		this.$rootScope.$broadcast( 'languageChanged' );
	}
}

/**
 *
 * @type {{templateUrl: string, controller: AppLanguageSwitcherController, controllerAs: string, bindings: {}}}
 */
export const AppLanguageSwitcherComponent = {
	templateUrl: './views/app/language-switcher/language-switcher.component.html',
	controller: AppLanguageSwitcherController,
	controllerAs: 'vm',
	bindings: {}
}