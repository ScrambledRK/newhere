class LanguageSwitcherController
{
	/**
	 * @param {LanguageService} LanguageService
	 * @param {RoutingService} RoutingService
	 * @param {$state} $state
	 */
	constructor( LanguageService,
	             RoutingService,
	             $state )
	{
		'ngInject';

		let vm = this;

		this.LanguageService = LanguageService;
		this.RoutingService = RoutingService;
		this.$state = $state;

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
		if (this.$state.current.name === "main.landing" )
			this.RoutingService.goContent( null, null );

		this.LanguageService.changeLanguage( language );
	}
}

/**
 *
 * @type {{templateUrl: string, controller: LanguageSwitcherController, controllerAs: string, bindings: {}}}
 */
export const LanguageSwitcherComponent = {
	templateUrl: './views/app/main/language-switcher/language-switcher.component.html',
	controller: LanguageSwitcherController,
	controllerAs: 'vm',
	bindings: {}
}