class AppLanguageSwitcherController
{
	/**
	 * @param {LanguageService} LanguageService
	 */
	constructor( LanguageService,
	             $state )
	{
		'ngInject';

		let vm = this;

		this.LanguageService = LanguageService;
		this.languages = [];

		this.$state = $state;
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
		if (this.$state.current.name === "main.landing" )
			this.$state.go('main.content');

		this.LanguageService.changeLanguage( language );
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