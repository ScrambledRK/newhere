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
				url: '/cms/dashboard',

				data: {
					auth: true,
					roles: ['admin', 'superadmin', 'moderator']
				},

				views: {
					'body@cms': {
						templateUrl: getView( 'pages/dashboard/dashboard' )
					}
				}
			} )
}
