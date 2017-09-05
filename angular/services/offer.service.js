export class OfferService
{
	constructor( API,
	             $q,
	             ToastService,
	             $state,
	             $translate,
	             DialogService,
	             $rootScope )
	{
		'ngInject';

		this.API = API;
		this.ToastService = ToastService;
		this.$q = $q;
		this.$state = $state;
		this.DialogService = DialogService;
		this.$translate = $translate;

		this.cms = $rootScope.cms;
	}

	/**
	 *
	 * @returns {*}
	 */
	fetchAll()
	{
		let vm = this;
		return this.$q( function( resolve )
		{
			vm.API.all( 'offers' ).getList().then( function( response )
			{
				resolve( response )
			}, function( error )
			{
				console.log( error );
				this.$translate( 'Fehler beim Laden der Daten.' ).then( ( msg ) =>
				{
					this.ToastService.error( msg );
				} );
			} );
		} );
	}

	/**
	 *
	 * @param query
	 * @param success
	 * @param error
	 * @param force
	 * @returns {*}
	 */
	fetchFiltered( query, success, error, force )
	{
		let q = this.API.all( 'offers' ).getList( query );
		q.then( ( response ) =>
		{
			success( response );
		} );
		return q;
	}

	/**
	 *
	 * @param query
	 * @param success
	 * @param error
	 * @param force
	 * @returns {*}
	 */
	fetchSearch( query, success, error, force )
	{
		var q = this.API.one( 'offers' ).one( 'search' ).getList( query );
		q.then( ( response ) =>
		{
			success( response );
		} );
		return q;
	}

	/**
	 *
	 * @param id
	 * @param success
	 * @param error
	 * @returns {boolean}
	 */
	one( id, success, error )
	{
		if( !id )
			return false;

		this.API.one( 'offers', id ).get().then( ( item ) =>
		{
			success( item );
		}, error );
	}

	/**
	 *
	 * @param cms
	 */
	cancel( cms )
	{
		if( cms )
		{
			this.$state.go( "cms.offers" );
		}
		else
		{
			history.back();
		}
	}

	/**
	 *
	 * @param offer
	 */
	create( offer )
	{
		this.API.all( 'offer' ).post( offer ).then( () =>
		{
			this.$state.go( this.$state.current, {}, { reload: true } );
			this.$translate( 'Erfolgreich gespeichert.' ).then( ( msg ) =>
			{
				this.ToastService.show( msg );
			} );
			this.DialogService.hide();
		} );
	}

	/**
	 *
	 * @param offer
	 * @param success
	 * @param error
	 * @param goto
	 */
	save( offer, success, error, goto )
	{
		if( offer.id )
		{
			offer.save().then( ( response ) =>
				{
					this.$translate( 'Angebot aktualisiert.' ).then( ( msg ) =>
					{
						this.ToastService.show( msg );
					} );

					if( success )
						success( response );

					this.cancel( this.cms );
				},
				( error ) =>
				{
					this.$translate( 'Fehler beim Speichern der Daten.' ).then( ( msg ) =>
					{
						this.ToastService.error( msg );
					} );
				}
			);
		}
		else
		{
			this.API.all( 'offers' ).post( offer ).then( ( response ) =>
			{
				this.$state.go( this.$state.current, {}, { reload: true } );
				this.$translate( 'Erfolgreich gespeichert.' ).then( ( msg ) =>
				{
					this.ToastService.show( msg );
				} );

				this.DialogService.hide();

				if( success )
					success( response );

				if( goto )
				{
					this.$state.go( goto );
				}
				else
				{
					this.$state.go( "cms.offers" );
				}
			} );
		}
	}

	/**
	 *
	 * @param offer
	 */
	toggleEnabled( offer )
	{
		this.API.one( 'offers', offer.id ).customPUT( {
			enabled: offer.enabled ? 1 : 0
		}, 'toggleEnabled' ).then(
			( success ) =>
			{
				this.$translate( 'Angebot aktualisiert.' ).then( ( msg ) =>
				{
					this.ToastService.show( msg );
				} );
			},
			( error ) =>
			{
				console.log( error );
				this.$translate( 'Fehler beim Speichern der Daten.' ).then( ( msg ) =>
				{
					this.ToastService.error( msg );
				} );
				offer.enabled = !offer.enabled;
			}
		);
	}

	/**
	 *
	 * @param list
	 * @param success
	 * @param error
	 */
	bulkRemove( list, success, error )
	{
		let ids = [];
		angular.forEach( list, ( item ) =>
		{
			ids.push( item.id );
		} );
		this.API.several( 'offers', ids ).remove().then( ( response ) =>
		{
			this.$translate( '%d Angebote gelöscht.' ).then( ( msg ) =>
			{
				this.ToastService.show(
					sprintf( msg, response.data.deletedRows )
				);
			} );
			success( response.data.offers );
		} );
	}

	/**
	 *
	 * @param list
	 * @param field
	 * @param value
	 * @param success
	 * @param error
	 */
	bulkAssign( list, field, value, success, error )
	{
		let ids = [];

		angular.forEach( list, ( item ) =>
		{
			ids.push( item.id );
		} );

		this.API.several( 'offers', ids ).patch( {
			field: field,
			value: value
		} ).then( ( response ) =>
		{
			this.$translate( 'Angebot aktualisiert.' ).then( ( msg ) =>
			{
				this.ToastService.show( msg );
			} );
			this.ToastService.show( 'Offers successfully updated!' );
			success( response.data.offers );
		} );
	}
}
