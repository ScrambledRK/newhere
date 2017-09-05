export class LanguageService
{
	/**
	 *
	 * @param {*} API
	 * @param {*} $window
	 * @param {*} $translate
	 */
	constructor( API,
	             $window,
	             $translate )
	{
		'ngInject';

		this.$translate = $translate;
		this.$window = $window;
		this.API = API;

		this.publishedLanguages = null;
		this.selectedLanguage = '';
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
		this.selectedLanguage = this.$window.localStorage.language = language;
		this.$translate.use( language );

		return this.selectedLanguage;
	}

}
