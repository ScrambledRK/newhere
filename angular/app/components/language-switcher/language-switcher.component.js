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

		this.LanguageService = LanguageService;
		this.RoutingService = RoutingService;
		this.$state = $state;

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
		if( this.$state.current.name === "main.landing" )
			this.RoutingService.goContent( null, null );

		this.LanguageService.changeLanguage( language );
	}
}

//
export const LanguageSwitcherComponent = {
	template: require( './language-switcher.component.html' ),
	controller: LanguageSwitcherController,
	controllerAs: 'vm',
	bindings: {}
};