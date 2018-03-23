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

		this.publishedLanguages = [];
		this.override = null;

		//
		this.API.all('languages').one('published').getList().then( (list) =>
		{
			for( let j = 0; j < list.length; j++ )
			{
				this.publishedLanguages[j] = list[j];
				this.publishedLanguages[j].active = true;
			}

			if( this.override )
			{
				this.overrideLanguages( this.override );
				this.override = null;
			}
		} );

		this.log();
	}

	/**
	 * @returns {*|{promise}}
	 */
	fetchPublished()
	{
		return this.publishedLanguages;
	}

	//
	overrideLanguages( languages )
	{
		if( this.publishedLanguages.length <= 0 )
		{
			this.override = languages;
			return;
		}

		//
		if( languages === null )
		{
			this.override = null;

			for( let i = 0; i < this.publishedLanguages.length; i++ )
				this.publishedLanguages[i].active = true;

			this.$rootScope.$broadcast( 'checkLanguage', this.$rootScope.language );
		}
		else
		{
			for( let i = 0; i < this.publishedLanguages.length; i++ )
				this.publishedLanguages[i].active = false;

			//
			for( let i = 0; i < languages.length; i++ )
			{
				let index = this.indexOf( languages[i].locale, this.publishedLanguages );

				if( index > -1 )
					this.publishedLanguages[index].active = true;
			}

			this.$rootScope.$broadcast( 'checkLanguage', this.$rootScope.language );
		}
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

		window.ga('send', {
			hitType: 'event',
			eventCategory: 'language',
			eventAction: 'change',
			eventValue: language
		});

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

	indexOf( language, list )
	{
		if( !list )
			return -1;

		for( let i = 0; i < list.length; i++ )
		{
			if( list[i].language === language )
				return i;
		}

		return -1;
	}

	//
	isActive( language )
	{
		let index = this.indexOf( language, this.publishedLanguages );

		if( index > 0 )
			return this.publishedLanguages[index].active;

		return false;
	}

	/**
	 *
	 * @param language
	 */
	log( language )
	{
		//console.log( "language.uses", this.$translate.use() );
		//console.log( "language.proposed", this.$translate.proposedLanguage() );
		//console.log( "language.preferred", this.$translate.preferredLanguage() );
		//console.log( 'language.current', this.$rootScope.language );

		//if( language )
		//	console.log( 'language.select', language );
	}
}
