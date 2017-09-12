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
		.state( 'main.impressum',
			{
				url: '/impressum-agbs',

				views:
					{
						'body@main': {
							templateUrl: getView( 'main/impressum/impressum' )
						}
					}
			} )

		//
		.state( 'main.contribute',
			{
				url: '/contribute',

				views:
					{
						'body@main': {
							templateUrl: getView( 'main/contribute/contribute' )
						}
					}
			} )

		//
		.state( 'main.content',
			{
				url: '/{category:[a-zA-Z0-9\-]+}/{offer:[0-9]*}',

				params:
					{
						category: {
							value: 'start',
							dynamic: true,  // prevents re-instantiating of controllers
						},

						offer: {
							value: null,
						}
					},

				views:
					{
						'body@main': {
							templateUrl: getView( 'main/content/content' )
						},

						'toolbar@main.content': {
							template: "<main-toolbar></main-toolbar>"
						},

						'content@main.content': {
							templateProvider: function($stateParams)
							{
								if( $stateParams.offer )
									return "<main-offer-detail></main-offer-detail>";

								return "" +
									"<main-category-list></main-category-list>" +
									"<main-offer-list></main-offer-list>";
							}
						}
					}
			} )
}
