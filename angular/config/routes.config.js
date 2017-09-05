export function RoutesConfig( $stateProvider, $urlRouterProvider )
{
	'ngInject';

	let getView = ( viewName ) =>
	{
		return `./views/app/${viewName}.page.html`;
	};

	$urlRouterProvider.otherwise( '/' );

	// ------------------------------------------ //
	// ------------------------------------------ //

	$stateProvider
		.state( 'app',
			{
				abstract: true,

				views:
					{
						front: {
							templateUrl: getView( 'main' )
						},

						header: {},
						footer: {},
						main: {}
					}
			} )

		//
		.state( 'app.landing',
			{
				url: '/',
				data: {},

				views:
					{
						'header@app': {
							templateUrl: getView( 'main/header' )
						},
						'body@app': {
							templateUrl: getView( 'main/app-landing/app-landing' )
						}
					}
			} )
}
