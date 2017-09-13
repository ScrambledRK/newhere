export class RoutingService
{
	/**
	 * @param {*} $state
	 * @param {*} $rootScope
	 */
	constructor( $state,
	             $rootScope )
	{
		'ngInject';

		this.$state = $state;
		this.$rootScope = $rootScope;

		//
		this.$rootScope.$on( "$stateChangeStart", ( event, toState, toParams, fromState, fromParams ) =>
		{
			console.log( "routing.state.change.start: ", toParams );

			//
			this.resetViewVariables( toParams.offer );
		} );

		this.resetViewVariables( this.$state.params.offer );  // .current.params is always ui-router object, not parsed
	}

	/**
	 *
	 * @param {string} category
	 * @param {string} offer
	 * @return {string}
	 */
	getContentURL( category, offer )
	{
		let urlCategory = "start";
		let urlOffer = "";

		if( category && category !== "" )
			urlCategory = category;

		if( offer && category !== "" )
			urlOffer = offer;

		return "#!/offers/" + urlCategory + "/" + urlOffer;
	}

	/**
	 *
	 * @param {string} category
	 * @param {string} offer
	 */
	goContent( category, offer )
	{
		console.log( "routing.go.content: ", category, offer );

		//
		let params = {
			category:category,
			offer:offer
		};

		let config = {
			reload:false,
			inherit:false
		};

		//
		this.$state.go('main.content.offers', params, config );
		this.resetViewVariables( offer );                   // in case state does not change, reset still
	}

	/**
	 *
	 * @param {string} provider
	 * @return {string}
	 */
	getProviderURL( provider )
	{
		return "#!/providers/" + provider;
	}

	/**
	 *
	 * @param {string} provider
	 */
	goProvider( provider )
	{
		console.log( "routing.go.provider: ", provider );

		//
		let params = {
			provider: provider
		};

		let config = {
			reload:false,
			inherit:false
		};

		//
		this.$state.go('main.content.providers', params, config );
		this.resetViewVariables( provider );                   // in case state does not change, reset still
	}

	//
	resetViewVariables( detail )
	{
		if( detail && detail !== '' )
		{
			this.$rootScope.isSplit = true;
			this.$rootScope.showMap = true;
			this.$rootScope.showDetails = false;
		}
		else
		{
			this.$rootScope.isSplit = false;
			this.$rootScope.showMap = false;
			this.$rootScope.showDetails = false;
		}
	}
}
