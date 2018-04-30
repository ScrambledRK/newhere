export class OfferService
{
	/**
	 */
	constructor( API,
	             $rootScope,
	             $q, )
	{
		'ngInject';

		//
		this.API = API;
		this.$rootScope = $rootScope;
		this.$q = $q;

		this.defer = null;

		// --------------------------- //

		//
		this.offers = [];
		this.numItems = 0;
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	//
	fetchList( query )
	{
		let config = this.prepareQuery();

		//
		return this.API.all( 'cms/offers' ).withHttpConfig( config ).getList( query )
			.then( ( response ) =>
			{
				this.numItems = response.count;

				this.offers.length = 0;
				this.offers.push.apply( this.offers, response );

				for( let i = 0; i < this.offers.length; i++ )
					this._setupOffer( this.offers[i] );

				this.resolveQuery();
			} )
		;
	}

	_setupOffer( offer )
	{
		if( offer.enabled )
		{
			let n = new Date().getTime();

			let isS = !offer.valid_from || new Date(offer.valid_from).getTime() < n;
			let isE = !offer.valid_until || new Date(offer.valid_until).getTime() > n;

			if( isS && isE )
			{
				offer.isVisible = true;
			}
			else
			{
				offer.isVisible = false;
			}
		}
		else
		{
			offer.isVisible = false;
		}
	}

	/**
	 *
	 * @param offerList
	 */
	deleteList( offerList )
	{
		let config = this.prepareQuery();
		let promises = [];

		//
		angular.forEach( offerList, ( item ) =>
		{
			let promise = this.API.one( 'cms/offers', item.id ).withHttpConfig( config ).remove()
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
		return this.$q.all( promises )
			.then( () =>
			{
				this.resolveQuery();
			});
	}

	/**
	 *
	 * @param offerList
	 */
	updateList( offerList )
	{
		let config = this.prepareQuery();
		let promises = [];

		//
		angular.forEach( offerList, ( item ) =>
		{
			let promise = this.API.one( 'cms/offers', item.id ).withHttpConfig( config ).customPUT( item )
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
		return this.$q.all( promises )
			.then( () =>
			{
				this.resolveQuery();
			});
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

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

	prepareQuery()
	{
		//if( this.$rootScope.isLoading )
		//	console.log("query already in process");

		this.$rootScope.isLoading = true;

		//
		if( this.defer !== null )
			this.defer.resolve();

		//
		this.defer = this.$q.defer();

		return {
			timeout: this.defer.promise
		};
	}

	resolveQuery()
	{
		this.defer = null;

		this.$rootScope.isLoading = false;
		this.$rootScope.$broadcast( 'offersChanged', this );
	}
}
