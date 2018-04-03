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
		if( !query || query.length === 0 )
			return;

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

	getAddressDetail( address )
	{
		if( !address || !address.id || address.id.length === 0 )
			return;

		return this.$http.get( '/api/search/address/detail/' + address.id );
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
