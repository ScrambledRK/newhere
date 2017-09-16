export function RoutesConfig( $stateProvider, $urlRouterProvider )
{
	'ngInject';

	let getView = ( viewName ) =>
	{
		return `./views/app/pages/${viewName}.page.html`;
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
							templateUrl: getView( 'main' )
						},

						'header@main': {
							template: "<app-header></app-header>" +
							"<side-menu></side-menu>"
						}
					}
			} )

		//
		.state( 'main.landing',
			{
				url: '/',

				views:
					{
						'body@main': {
							templateUrl: getView( 'landing/landing' )
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
							templateUrl: getView( 'impressum/impressum' )
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
							templateUrl: getView( 'contribute/contribute' )
						}
					}
			} )

		//
		.state( 'main.content',
			{
				abstract:true,

				views:
					{
						'body@main': {
							template: "<content-page>"
						}
					}
			} )

		//
		.state( 'main.content.offers',
			{
				url: '/offers/{category:[a-zA-Z0-9\-]+}/{offer:[0-9]*}',

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
						'navigation@main.content': {
							template: "<toolbar></toolbar>"
						},

						'content@main.content': {
							templateProvider: function($stateParams)
							{
								if( $stateParams.offer )
									return "<content-detail-page></content-detail-page>";

								return "<content-list-page></content-list-page>";
							}
						}
					}
			} )

		//
		.state( 'main.content.providers',
			{
				url: '/providers/{provider:[a-zA-Z0-9-]+}',

				params:
					{
						provider: {
							value: "all"
						}
					},

				views:
					{
						'navigation@main.content': {
							template: ""
						},

						'content@main.content': {
							templateProvider: function($stateParams)
							{
								if( $stateParams.provider !== 'all' )
									return "<provider-detail-page></provider-detail-page>";

								return "" +
									"<provider-list-page></provider-list-page>";
							}
						}
					}
			} )
}
