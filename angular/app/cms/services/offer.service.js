export class OfferService
{
	/**
	 */
	constructor( API,
	             $q, )
	{
		'ngInject';

		//
		this.API = API;
		this.$q = $q;

		// --------------------------- //

		//
		this.offers = [];

	}

	//
	fetchList( query )
	{
		this.offers.length = 0;

		//
		return this.API.all( 'cms/offers' ).getList( query )
			.then( ( response ) =>
			{
				this.offers.length = 0;
				this.offers.push.apply( this.offers, response );
			} )
		;
	}

	/**
	 *
	 * @param offerList
	 */
	deleteList( offerList )
	{
		let promises = [];

		//
		angular.forEach( offerList, ( item ) =>
		{
			let promise = this.API.one( 'cms/offers', item.id ).remove()
				.then( ( response ) =>
					{
						if( response.data && response.data.offer )
						{
							let index = this.indexOf( response.data.offer.id );

							if( index !== -1 )
								this.offers.splice( index, 1 );
						}
					},
					( error ) =>
					{
						throw error;
					}
				);

			promises.push( promise );
		} );

		//
		return this.$q.all( promises );
	}

	/**
	 *
	 * @param offerList
	 */
	updateList( offerList )
	{
		let promises = [];

		//
		angular.forEach( offerList, ( item ) =>
		{
			let promise = this.API.one( 'cms/offers', item.id ).customPUT( item )
				.then( ( response ) =>
					{
						return response;
					},
					( error ) =>
					{
						throw error;
					}
				);

			promises.push( promise );
		} );

		//
		return this.$q.all( promises );
	}

	//
	indexOf( offerID )
	{
		let result = -1;

		angular.forEach( this.offers, ( offer, index ) =>
		{
			if( offer.id === offerID )
				result = index;
		} );

		return result;
	}
}
