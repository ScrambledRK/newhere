export class LanguageService
{
	/**
	 *
	 * @param {*} API
	 * @param {*} $translate
	 * @param {*} $rootScope
	 */
	constructor( API,
	             $translate,
	             $rootScope,
	             $log )
	{
		'ngInject';

		this.API = API;
		this.$translate = $translate;
		this.$rootScope = $rootScope;
		this.$log = $log;

		this.publishedLanguages = null;
		this.log();
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
		this.log( language );

		if( language === this.$rootScope.language )
			return language;

		//
		switch( language )
		{
			case "ar":
			case "fa":
				this.$rootScope.isTextAlignmentLeft = false;
				break;

			default:
				this.$rootScope.isTextAlignmentLeft = true;
		}

		//
		this.$translate.use( language ).then( (lang) =>
		{
			this.$rootScope.language = lang;
			this.$rootScope.$broadcast( 'languageChanged', this.$rootScope.language );

			this.log( lang );

			return lang;
		} );


		return this.$rootScope.language = language;
	}

	/**
	 *
	 * @param language
	 */
	log( language )
	{
		console.log( "language.uses", this.$translate.use() );
		console.log( "language.proposed", this.$translate.proposedLanguage() );
		console.log( "language.preferred", this.$translate.preferredLanguage() );
		console.log( 'language.current', this.$rootScope.language );

		if( language )
			console.log( 'language.select', language );
	}
}
