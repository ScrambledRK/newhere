class RequestTableController
{
	constructor( $sessionStorage,
	             $rootScope,
	             $state,
	             $q,
	             API,
	             UserService,
	             ToastService,
	             DialogService )
	{
		'ngInject';

		//
		let vm = this;

		//
		this.$sessionStorage = $sessionStorage;
		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$q = $q;

		this.API = API;
		this.UserService = UserService;
		this.ToastService = ToastService;
		this.DialogService = DialogService;

		//
		this.loading = true;
		this.promise = null;

		//
		this.query =
			{
				order: '-user_id',
				limit: 10,
				page: 1
			};

		/**
		 * not a "member" method because of stupid bug where "this" reference is lost
		 * this issue is specific to material design components
		 */
		this.onQueryUpdate = () =>
		{
			vm.promise = vm.API.all( 'cms/users/pending' ).getList( vm.query )
				.then( ( item ) =>
					{
						vm.items.length = 0;
						vm.items.push.apply( vm.items, item );
					}
				);
		};
	}

	$onInit()
	{
		this.query.user = this.user ? this.user.id : null;



		this.onQueryUpdate();
	}

	//
	getURL( item, type )
	{
		switch( type )
		{
			case "provider":
			{
				if( this.UserService.isAdministrator() )
				{
					return "#!/cms/providers//" + item.ngo.id;
				}
				else
				{
					return "#!/providers/" + item.ngo.id;
				}
			}

			case "user":
			{
				if( this.UserService.isAdministrator() )
				{
					return "#!/cms/users//" + item.user.id;
				}
				else
				{
					return "#!/cms/users/" + item.user.id;
				}
			}
		}

		return "";
	}

	//
	deleteItem( item, isAccept )
	{
		//console.log( "delete request", item );

		let title = 'Delete Profile-Change-Request?';
		let text = 'You are about to delete a profile change request. Type in DELETE and confirm';
		let label = 'Delete Secret';
		let secret = "DELETE";
		let success = 'Change-Request gelöscht.';

		if( isAccept )
		{
			title = 'Perform Profile-Change-Request?';
			text = 'You are about to perform a profile change request. Type in PERFORM and confirm';
			label = 'Perform Secret';
			secret = "PERFORM";
			success = "Change-Request successful"
		}

		//
		this.DialogService.prompt( title, text, label )
			.then( ( response ) =>
			{
				if( response !== secret )
				{
					this.DialogService.alert( 'Not correct',
						'Thankfully, you entered the wrong secret. So nothing is going to change... for now.' );
				}
				else
				{
					this.API.one( 'cms/users/pending', item.id ).remove()
						.then( ( response ) =>
							{

								this.ToastService.show( success );

								if( response.data )
								{
									let index = this.indexOf( response.data.pending.id );

									if( index !== -1 )
										this.items.splice( index, 1 );
								}

								if( isAccept )
									this.$rootScope.$broadcast( 'request.accept', item );
							},
							( error ) =>
							{
								throw error;
							}
						);
				}
			} );

	}

	acceptItem( item )
	{
		this.deleteItem( item, true );
	}

	//
	indexOf( requestID )
	{
		let result = -1;

		angular.forEach( this.items, ( item, index ) =>
		{
			if( item.id === requestID )
				result = index;
		} );

		return result;
	}

	// --------------------------------------- //
	// --------------------------------------- //

	//
	isElementVisible( name )
	{
		if( name === "user" )
			return Boolean(this.overview) && this.UserService.isAdministrator();

		if( name === "delete" )
			return !Boolean(this.overview); //this.UserService.isAdministrator();

		if( name === "accept" )
			return !Boolean(this.overview) &&  this.UserService.isAdministrator();

		//
		return false;
	}

	//
	isElementEnabled( name )
	{
		return false;
	}
}

export const RequestTableComponent = {
	template: require( './request-table.component.html' ),
	controller: RequestTableController,
	controllerAs: 'vm',
	bindings: {
		items: '=ngModel',
		overview: '=overview',
		user: '=user'
	},
};
