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

		return "#!/" + urlCategory + "/" + urlOffer;
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
		this.$state.go('main.content', params, config );
		this.resetViewVariables( offer );                   // in case state does not change, reset still
	}

	//
	resetViewVariables( offer )
	{
		if( offer && offer !== '' )
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
