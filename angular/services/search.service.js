export class SearchService
{
	constructor( API, $http, $q )
	{
		'ngInject';

		this.$q = $q;
		this.aborter = $q.defer();
		this.$http = $http;

		this.API = API;

		//
		this.empty = Promise.resolve([]);
	}

	/**
	 *
	 * @param string query
	 */
	searchAddress( query )
	{
		if( !(/\d/.test(query)) )
			return this.empty;

		//
		if( this.$http.pendingRequests.length )
		{
			this.aborter.resolve();
			this.aborter = this.$q.defer();
		}

		return this.$http.get( '/api/search/address/' + query,
			{
				timeout: this.aborter.promise
			} )
			.then( function( response )
				{
					return response.data;
				},
				( error ) =>
				{
					throw error;
				} );
	}

	/**
	 *
	 * @param {string} value
	 * @returns {promise}
	 */
	searchOffers( value )
	{
		let query = {
			query: value
		};

		return this.API.all( 'search' ).customGET( 'offers', query );
	}
}
