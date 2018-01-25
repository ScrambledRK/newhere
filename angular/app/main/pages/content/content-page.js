class ContentPageController
{
	/**
	 * @param {RoutingService} RoutingService
	 * @param {MapService} MapService
	 * @param {*} $rootScope
	 * @param {*} $document
	 * @param {*} $mdMedia
	 * @param {*} $timeout
	 * @param {*} $scope
	 */
	constructor( RoutingService,
	             MapService,
	             $rootScope,
	             $document,
	             $mdMedia,
	             $timeout,
	             $scope )
	{
		'ngInject';

		//
		this.RoutingService = RoutingService;
		this.MapService = MapService;
		this.$rootScope = $rootScope;
		this.$document = $document;
		this.$mdMedia = $mdMedia;
		this.$timeout = $timeout;
		this.$scope = $scope;

		this.$timeout( () => { this.resizeContent(); }, 0, false );
	}

	$onInit()
	{
		this.$rootScope.$watch( () => { return this.$mdMedia('gt-sm'); }, () => {
			this.resizeContent();
		});

		let onViewStateChanged = this.$rootScope.$on( "viewStateChanged", ( event ) =>
		{
			this.$timeout( () => { this.resizeContent(); }, 0, false );
		} );

		let onContentChanged = this.$rootScope.$on( "contentChanged", ( event ) =>
		{
			this.MapService.invalidateSize();
		} );

		this.$scope.$on('$destroy', () =>
		{
			onViewStateChanged();
			onContentChanged();
		});
	}

	//
	resizeContent()
	{
		let isMapFocused = this.RoutingService.isMapFocused;
		let isDetailState = this.RoutingService.isDetailState;

		//console.log("resizeContent", isMapFocused, isDetailState );

		let contentElement = angular.element( this.$document[0].querySelector( '#content-container' ) );
		let mapElement = angular.element( this.$document[0].querySelector( '#map-container' ) );

		//
		this.removeFlexClasses( contentElement );
		this.removeFlexClasses( mapElement );

		if( this.$mdMedia("gt-sm") )
		{
			contentElement.addClass( "flex-100" );
			mapElement.addClass( "flex-100" );
		}
		else
		{
			if( isMapFocused )
			{
				if( isDetailState )
				{
					contentElement.addClass( "flex-40" );
					mapElement.addClass( "flex-60" );
				}
				else
				{
					contentElement.addClass( "flex-0" );
					mapElement.addClass( "flex-100" );
				}
			}
			else
			{
				contentElement.addClass( "flex-100" );
				mapElement.addClass( "flex-0" );
			}

			//
			this.$timeout( () => { this.MapService.invalidateSize(); }, 150, false );
			this.$timeout( () => { this.MapService.invalidateSize(); }, 350, false );
			this.$timeout( () => { this.MapService.invalidateSize(); }, 500, false );
		}
	}

	removeFlexClasses( element )
	{
		element.removeClass( "flex-0" );
		element.removeClass( "flex-40" );
		element.removeClass( "flex-60" );
		element.removeClass( "flex-100" );
	}
}

//
export const ContentPageComponent = {

	template: require( './content-page.html' ),
	controller: ContentPageController,
	controllerAs: 'vm',
	bindings: {}
};