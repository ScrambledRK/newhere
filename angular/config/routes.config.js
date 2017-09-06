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
				data: {},

				views:
					{
						front: {
							templateUrl: getView( 'main' )
						},

						'header@app': {
							templateUrl: getView( 'main/header' )
						},

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
						'body@app': {
							templateUrl: getView( 'main/landing/landing' )
						}
					}
			} )

		//
		.state( 'app.start',
			{
				abstract: true,
				data: {},

				views:
					{
						'body@app': {
							templateUrl: getView( 'main/start/start' )
						}
					}
			} )

		//
		.state( 'app.start.categories',
			{
				url: '/start',
				data: {},

				views:
					{
						'content@app.start': {
							template: "<app-categories-content/>"
						}
					}
			} )
}
