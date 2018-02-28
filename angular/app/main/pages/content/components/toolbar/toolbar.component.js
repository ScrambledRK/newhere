class ToolbarController
{
	/**
	 *
	 * @param {ContentService} ContentService
	 * @param {RoutingService} RoutingService
	 * @param $rootScope
	 * @param $scope
	 * @param $state
	 */
	constructor( ContentService,
	             RoutingService,
	             $mdMedia,
	             $rootScope,
	             $scope,
	             $state )
	{
		'ngInject';

		//
		this.ContentService = ContentService;
		this.RoutingService = RoutingService;

		this.$mdMedia = $mdMedia;

		this.$rootScope = $rootScope;
		this.$scope = $scope;
		this.$state = $state;
	}

	//
	$onInit()
	{
		this.setContent();

		// ------------- //

		this.$rootScope.$watch( () =>
		{
			return this.$mdMedia( 'gt-xs' );
		}, () =>
		{
			this.setContent();
		} );

		this.$rootScope.$watch( () =>
		{
			return this.$mdMedia( 'gt-sm' );
		}, () =>
		{
			this.setContent();
		} );

		let onCategoryChanged = this.$rootScope.$on( "contentChanged", ( event ) =>
		{
			this.setContent();
		} );

		this.$scope.$on( '$destroy', () =>
		{
			onCategoryChanged();
		} );
	}

	//
	setContent()
	{
		//
		this.categories = [];
		this.detail = null;
		this.max = 0;

		//
		let category = this.ContentService.category;

		//if( !category )
		//	return;

		//
		let limit = 1;

		if( this.$mdMedia( "gt-xs" ) )
			limit = 2;

		if( this.$mdMedia( "gt-sm" ) )
			limit = 4;

		if( this.ContentService.offer || this.ContentService.provider )
			limit--;

		//
		while( category )
		{
			if( this.categories.length < limit )
			{
				if( this.$rootScope.isTextAlignmentLeft )
				{
					this.categories.unshift( category );
				}
				else
				{
					this.categories.push( category );
				}
			}

			category = category.parent;
			this.max++;
		}

		//
		if( this.ContentService.offer )
		{
			this.detail = {
				isOffer: true,
				id: this.ContentService.offer.id,
				title: this.ContentService.offer.title,
				icon: this.ContentService.offer.street ? 'location_on' : 'insert_link'
			};

			//
			if( this.ContentService.provider )
			{
				let custom = {
					isCustom: true,
					id: this.ContentService.provider.id,
					title: this.ContentService.provider.organisation,
					icon: 'location_on'
				};

				if( this.$rootScope.isTextAlignmentLeft )
				{
					this.categories.push( custom );

					if( this.categories.length >= limit )
						this.categories.shift();
				}
				else
				{
					this.categories.unshift( custom );

					if( this.categories.length >= limit )
						this.categories.pop();
				}

				this.max++;
			}
		}
		else if( this.ContentService.provider )
		{
			this.detail = {
				isOffer: false,
				id: this.ContentService.provider.id,
				title: this.ContentService.provider.organisation,
				icon: 'location_on'
			};
		}

		//
		console.log("-------------");

		angular.forEach( this.categories, ( child, key ) =>
		{
			console.log("  cat:", child );
		} );
	}

	//
	goCategory( category )
	{
		if( category.slug === 'providers' )
		{
			this.RoutingService.goProvider( 'all' );
		}
		else if( category.isCustom )
		{
			return this.RoutingService.goProvider( category.id );
		}
		else
		{
			this.RoutingService.goContent( category, null );
		}
	}

	//
	goDetail( item )
	{
		if( item.isOffer )
		{
			this.RoutingService.goContent( this.ContentService.category, item.id );
		}
		else
		{
			this.RoutingService.goProvider( item.id );
		}
	}

	//
	getURL( item, type )
	{
		if( type === "detail" )
		{
			if( item.isOffer )
			{
				return this.RoutingService.getContentURL( this.ContentService.category, item.id );
			}
			else
			{
				return this.RoutingService.getProviderURL( item.id );
			}
		}

		if( item.slug === 'providers' )
		{
			return this.RoutingService.getProviderURL( 'all' );
		}
		else if( item.isCustom )
		{
			return this.RoutingService.getProviderURL( item.id );
		}
		else
		{
			return this.RoutingService.getContentURL( item, null );
		}
	}

	//
	goBack()
	{
		if( this.detail && this.categories.length === 0 )
		{
			if( this.detail.isOffer )
				return this.RoutingService.goContent( this.ContentService.category, null );

			return this.RoutingService.goProvider( "all" );
		}
		//
		let index = this.$rootScope.isTextAlignmentLeft ? 0 : this.categories.length - 1;
		let item = this.categories[index].parent;

		if( this.categories[index].isCustom )
			return this.RoutingService.goProvider( "all" );

		if( item )
			return this.RoutingService.goContent( item, null );

		//
		return this.RoutingService.goContent( null, null );
	}

	//
	getBackURL()
	{
		if( this.detail && this.categories.length === 0 )
		{
			if( this.detail.isOffer )
				return this.RoutingService.getContentURL( this.ContentService.category, null );

			return this.RoutingService.getProviderURL( "all" );
		}

		//
		let index = this.$rootScope.isTextAlignmentLeft ? 0 : this.categories.length - 1;
		let item = this.categories[index].parent;

		if( this.categories[index].isCustom )
			return this.RoutingService.getProviderURL( "all" );

		if( item )
			return this.RoutingService.getContentURL( item, null );

		//
		return this.RoutingService.getContentURL( null, null );
	}
}

//
export const ToolbarComponent = {
	template: require( './toolbar.component.html' ),
	controller: ToolbarController,
	controllerAs: 'vm',
	bindings: {}
};