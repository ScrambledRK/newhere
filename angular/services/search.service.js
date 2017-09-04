export class SearchService
{
	constructor( $http, $q )
	{
		'ngInject';

		this.$q = $q;
		this.aborter = $q.defer();
		this.$http = $http;
	}

	/**
	 *
	 * @param string query
	 */
	searchAddress( query )
	{
		if( this.$http.pendingRequests.length )
		{
			this.aborter.resolve();
			this.aborter = this.$q.defer();
		}

		return this.$http
			.get( '/api/search/address/' + query, {
				timeout: this.aborter.promise
			} )
			.then( function( response )
			{
				return response.data;
			} );
	}
}
