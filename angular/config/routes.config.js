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
		.state( 'main',
			{
				abstract: true,

				views:
					{
						front: {
							templateUrl: getView( 'main/main' )
						},

						'header@main': {
							template: "<main-header></main-header>" +
							"<main-side-menu></main-side-menu>"
						},

						footer: {},
						main: {}
					}
			} )

		//
		.state( 'main.landing',
			{
				url: '/',

				views:
					{
						'body@main': {
							templateUrl: getView( 'main/landing/landing' )
						}
					}
			} )

		//
		.state( 'main.content',
			{
				url: '/content/:slug',

				params:
					{
						slug: {
							type: 'string',
							value: 'start',
							dynamic: true   // prevents the controller to be recreated
						}                   // see content.component/service
					},

				views:
					{
						'body@main': {
							templateUrl: getView( 'main/content/content' )
						},

						'content@main.content': {
							template: "<main-content></main-content>"
						}
					}
			} )

}
