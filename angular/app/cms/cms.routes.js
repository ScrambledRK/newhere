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
				url: '/dashboard',

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user', 'moderator'],
					title: "Dashboard"
				},

				views: {
					'body@cms': {
						templateUrl: getView( 'pages/dashboard/dashboard' )
					}
				}
			} )

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
}
