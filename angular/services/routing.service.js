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
			this.onStateChanged( toParams );
		} );

		console.log( this.$state );

		this.onStateChanged( this.$state.params );  // .current.params is always ui-router object, not parsed
	}

	//
	onStateChanged( toParams )
	{
		console.log( "state change start: ", toParams );

		//
		let offer = toParams.offer;

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

	/**
	 *
	 * @param {string} category
	 * @param {string} offer
	 */
	goContent( category, offer )
	{
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
	}

}
