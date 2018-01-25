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
			this.updateStateParams( toParams );
		} );

		this.updateStateParams( this.$state.params );  // .current.params is always ui-router object, not parsed
	}

	// ------------------------------------- //
	// ------------------------------------- //

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
		//console.log( "routing.go.content: ", category, offer );

		//
		let params = {
			category: category,
			offer: offer
		};

		let config = {
			reload: false,
			inherit: false
		};

		//
		this.$state.go( 'main.content.offers', params, config );
		this.updateState( offer );                   // in case state does not change, reset still

		return true;
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
		//console.log( "routing.go.provider: ", provider );

		//
		let params = {
			provider: provider
		};

		let config = {
			reload: false,
			inherit: false
		};

		//
		this.$state.go( 'main.content.providers', params, config );
		this.updateState( provider ); // in case state does not change, reset still

		return true;
	}

	// ------------------------------------- //
	// ------------------------------------- //

	//
	updateStateParams( params )
	{
		let hasOffer = Boolean(params.offer && params.offer !== '');
		let hasProvider = Boolean(params.provider && params.provider !== '');

		if( !hasOffer && !hasProvider )
			this.updateState( null );

		if( hasOffer )
			this.updateState( params.offer );

		if( hasProvider )
			this.updateState( params.provider );
	}

	//
	updateState( detail )
	{
		let previous = this.isDetailState;
		this.isDetailState = Boolean(detail && detail !== '');

		//
		if( previous !== this.isDetailState )
			this.viewStateChanged = true;

		//
		this.setMapFocus( this.isDetailState );
	}

	//
	setMapFocus( isFocused )
	{
		let previous = this.isMapFocused;
		this.isMapFocused = isFocused;

		//
		if( previous !== this.isMapFocused )
			this.viewStateChanged = true;

		this.broadcastChange();
	}

	//
	broadcastChange()
	{
		if( this.viewStateChanged )
		{
			//console.log("viewStateChanged", this.isMapFocused, this.isDetailState );

			this.$rootScope.$broadcast( 'viewStateChanged', this.isMapFocused, this.isDetailState );
			this.viewStateChanged = false;
		}
	}
}
