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
					return "#!/cms/providers/" + item.ngo.id;
				}
				else
				{
					return "#!/providers/" + item.ngo.id;
				}
			}

			case "user":
				return "#!/cms/users/" + item.user.id;
		}

		return "";
	}

	//
	deleteItem( item )
	{
		console.log( "delete request", item );

		this.DialogService.prompt( 'Deleting Profile-Change-Request?',
			'You are about to delete a profile change request. Type in DELETE and confirm?',
			'Delete Secret' )
			.then( ( response ) =>
			{
				if( response !== "DELETE" )
				{
					this.DialogService.alert( 'Not correct',
						'Thankfully, you entered the wrong secret. So nothing is going to change... for now.' );
				}
				else
				{
					this.API.one( 'cms/users/pending', item.id ).remove()
						.then( ( response ) =>
							{
								this.ToastService.show( 'Change-Request gelöscht.' );

								if( response.data )
								{
									let index = this.indexOf( response.data.id );

									if( index !== -1 )
										this.items.splice( index, 1 );
								}
							},
							( error ) =>
							{
								throw error;
							}
						);
				}
			} );

	}

	//
	indexOf( requestID )
	{
		let result = -1;

		angular.forEach( this.items, ( user, index ) =>
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
			return this.UserService.isAdministrator();

		if( name === "delete" )
			return true; //this.UserService.isAdministrator();

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
		items: '=ngModel'
	},
};
