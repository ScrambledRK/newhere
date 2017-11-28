class CmsMenuController
{
	constructor( UserService, $rootScope, $scope )
	{
		'ngInject';

		//
		this.UserService = UserService;
		this.$rootScope = $rootScope;
		this.$scope = $scope;

		//
		this.roles = this.UserService.roles;

		//
		this.items = [
			{
				sref: 'cms.dashboard',
				icon: 'dashboard',
				title: 'Dashboard',
				roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user', 'moderator', 'user']
			},
			{
				sref: 'cms.offers',
				icon: 'local_offer',
				title: 'Offers',
				roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user']
			},
			{
				sref: 'cms.providers',
				icon: 'business',
				title: 'Providers',
				roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user']
			},
			{
				sref: 'cms.translations',
				icon: 'translate',
				title: 'Translations',
				roles: ['admin', 'superadmin', 'moderator']
			},
			// {
			// 	sref: 'cms.categories',
			// 	icon: 'list',
			// 	title: 'Categories',
			// 	roles: ['admin', 'superadmin']
			// },
			// {
			// 	sref: 'cms.filters',
			// 	icon: 'filter_list',
			// 	title: 'Filters',
			// 	roles: ['admin', 'superadmin']
			// },
			// {
			// 	sref: 'cms.languages',
			// 	icon: 'font_download',
			// 	title: 'Languages',
			// 	roles: ['admin', 'superadmin']
			// },
			{
				sref: 'cms.users',
				icon: 'group',
				title: 'Users',
				roles: ['admin','superadmin', 'organisation-admin', 'organisation-user' ]
			}
		];

		//
		let onUserChanged = this.$rootScope.$on( "userChanged", ( event ) =>
		{
			this.setAllowed();
		} );

		this.$scope.$on( '$destroy', () =>
		{
			onUserChanged();
		} );

		this.setAllowed();
	}

	//
	setAllowed()
	{
		angular.forEach( this.items, ( item ) =>
		{
			var allowed = false;

			//
			angular.forEach( item.roles, ( role ) =>
			{
				angular.forEach( this.roles, ( userRole ) =>
				{
					if( role === userRole.name )
					{
						allowed = true;
					}
				} );
			} );

			item.allowed = allowed;
		} );
	}
}

export const CmsMenuComponent = {
	template: require( './cms-menu.component.html' ),
	controller: CmsMenuController,
	controllerAs: 'vm',
	bindings: {}
};