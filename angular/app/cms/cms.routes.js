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
				url: '/offers',

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
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user' ],
					title: "Angebote",
					create: true
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
				url: '/cms/providers',

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user' ],
					title: "Anbieter"
				},

				views: {
					'body@cms': {
						templateUrl: getView( 'pages/providers/providers' )
					}
				}
			} )
}
