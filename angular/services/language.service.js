export class LanguageService
{
	/**
	 *
	 * @param {*} API
	 * @param {*} $window
	 * @param {*} $translate
	 * @param {*} $rootScope
	 */
	constructor( API,
	             $window,
	             $translate,
	             $rootScope )
	{
		'ngInject';

		this.API = API;
		this.$translate = $translate;
		this.$window = $window;
		this.$rootScope = $rootScope;

		this.publishedLanguages = null;
		this.selectedLanguage = this.$window.localStorage.language;
	}

	/**
	 * @returns {*|{promise}}
	 */
	fetchPublished()
	{
		if( this.publishedLanguages !== null )
			return this.publishedLanguages;

		return this.publishedLanguages = this.API.all('languages').one('published').getList();
	}

	/**
	 *
	 * @param {string|*} language
	 * @returns {string|*}
	 */
	changeLanguage( language )
	{
		if( language === this.selectedLanguage )
			return language;

		this.selectedLanguage = this.$window.localStorage.language = language;

		this.$translate.use( language );
		this.$rootScope.$broadcast( 'languageChanged' );

		return this.selectedLanguage;
	}

}
