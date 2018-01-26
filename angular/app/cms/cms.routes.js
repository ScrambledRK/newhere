export function CmsRoutesConfig( $stateProvider, $urlRouterProvider )
{
	'ngInject';

	let getView = ( viewName ) =>
	{
		return `./views/app/cms/${viewName}.page.html`;
	};

	$urlRouterProvider.otherwise( '/' );

	// ------------------------------------------ //
	// ------------------------------------------ //

	$stateProvider
		.state( 'cms',
			{
				abstract: true,
				url: '/cms',

				views:
					{
						front:
						{
							template: "<cms-page></cms-page>"
						},

						header:
							{
							templateUrl: getView( 'components/header/header' )
						},

						footer:
							{
							templateUrl: getView( 'components/footer/footer' )
						}
					}
			} )

		//
		.state( 'cms.dashboard',
			{
				url: '/dashboard/{tab:[0-9]*}',

				params:
					{
						tab: {
							value: null,
						}
					},

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user', 'moderator', 'user'],
					title: "Dashboard"
				},

				views: {
					'body@cms': {
						template: "<cms-dashboard-page></cms-dashboard-page>"
					}
				}
			} )

		// --------------------------------------------- //
		// offers:

		//
		.state( 'cms.offers',
			{
				url: '/offers/{ngo:[0-9]*}',

				params:
					{
						ngo: {
							value: null,
						}
					},

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user' ],
					title: "Angebote"
				},

				views: {
					'body@cms': {
						template: "<cms-offer-list></cms-offer-list>"
					},

					'content@cms.offers': {
						template: "<offer-table></offer-table>"
					}
				}
			} )

		//
		.state( 'cms.offers.new',
			{
				url: '/new',

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user' ]
				},

				views: {
					'body@cms': {
						template: "<cms-offer-form></cms-offer-form>"
					}
				}
			} )

		//
		.state( 'cms.offers.edit',
			{
				url: '/{id:[0-9]+}',

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user' ]
				},

				views: {
					'body@cms': {
						template: "<cms-offer-form></cms-offer-form>"
					}
				}
			} )

		// --------------------------------------------- //
		// providers:

		//
		.state( 'cms.providers',
			{
				url: '/providers/{ngo:[0-9]*}',

				params:
					{
						ngo: {
							value: null,
						}
					},

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user' ],
					title: "Anbieter"
				},

				views: {
					'body@cms': {
						template: "<cms-provider-list></cms-provider-list>"
					},

					'content@cms.providers': {
						template: "<provider-table></provider-table>"
					}
				}
			} )

		//
		.state( 'cms.providers.new',
			{
				url: '/new',

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user' ]
				},

				views: {
					'body@cms': {
						template: "<cms-provider-form></cms-provider-form>"
					}
				}
			} )

		//
		.state( 'cms.providers.edit',
			{
				url: '/{id:[0-9]+}',

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user' ]
				},

				views: {
					'body@cms': {
						template: "<cms-provider-form></cms-provider-form>"
					}
				}
			} )

		// --------------------------------------------- //
		// users:

		//
		.state( 'cms.users',
			{
				url: '/users/{ngo:[0-9]*}',

				params:
					{
						ngo: {
							value: null,
						}
					},

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user' ],
					title: "Users"
				},

				views: {
					'body@cms': {
						template: "<cms-user-list></cms-user-list>"
					},

					'content@cms.users': {
						template: "<user-table></user-table>"
					}
				}
			} )

		//
		.state( 'cms.users.new',
			{
				url: '/new',

				data: {
					auth: true,
					roles: ['admin', 'superadmin' ]
				},

				views: {
					'body@cms': {
						template: "<cms-user-form></cms-user-form>"
					}
				}
			} )

		//
		.state( 'cms.users.edit',
			{
				url: '/{id:[0-9]+}',

				data: {
					auth: true,
					roles: ['admin', 'superadmin' ]
				},

				views: {
					'body@cms': {
						template: "<cms-user-form></cms-user-form>"
					}
				}
			} )

		// --------------------------------------------- //

		//
		.state( 'cms.translations',
			{
				url: '/translations/{type:[a-z]*}',

				params:
					{
						type: {
							value: "offer",
						}
					},

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user' ],
					title: "Übersetzungen"
				},

				views: {
					'body@cms': {
						template: "<cms-translation-list></cms-translation-list>"
					},

					'content@cms.translations': {
						template: "<translation-table></translation-table>"
					}
				}
			} )

		//
		.state( 'cms.categories',
			{
				url: '/categories',

				data: {
					auth: true,
					roles: ['admin', 'superadmin' ],
					title: "Kategorien"
				},

				views: {
					'body@cms': {
						template: "<cms-category-form></cms-category-form>"
					}
				}
			} )

		// --------------------------------------------- //
		// pages:

		//
		.state( 'cms.pages',
			{
				url: '/pages',

				data: {
					auth: true,
					roles: ['admin', 'superadmin' ],
					title: "Seiten"
				},

				views: {
					'body@cms': {
						template: "<cms-page-list></cms-page-list>"
					},

					'content@cms.pages': {
						template: "<page-table></page-table>"
					}
				}
			} )

		//
		.state( 'cms.pages.new',
			{
				url: '/new',

				data: {
					auth: true,
					roles: ['admin', 'superadmin' ]
				},

				views: {
					'body@cms': {
						template: "<cms-page-form></cms-page-form>"
					}
				}
			} )

		//
		.state( 'cms.pages.edit',
			{
				url: '/{id:[0-9]+}',

				data: {
					auth: true,
					roles: ['admin', 'superadmin' ]
				},

				views: {
					'body@cms': {
						template: "<cms-page-form></cms-page-form>"
					}
				}
			} )
}
