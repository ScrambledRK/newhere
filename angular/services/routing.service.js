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
	}

	/**
	 *
	 * @param {string} category
	 * @param {string} offer
	 */
	goContent( category, offer )
	{
		this.$rootScope.isSplit = false;
		this.$rootScope.showMap = false;
		this.$rootScope.showDetails = false;

		//
		let params = {
			category:category,
			offer:offer
		};

		let config = {
			reload:false,
			inherit:false
		};

		this.$state.go('main.content', params, config );
	}

}
