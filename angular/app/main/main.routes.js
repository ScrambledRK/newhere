export function MainRoutesConfig( $stateProvider, $urlRouterProvider )
{
	'ngInject';

	let getView = ( viewName ) =>
	{
		return `./views/app/main/pages/${viewName}.page.html`;
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
		.state( 'main.page',
			{
				url: '/page/{slug:[a-zA-Z0-9-]+}',

				params:
					{
						slug: {
							value: 'about-us'
						}
					},

				views:
					{
						'body@main': {
							templateProvider: function( $stateParams )
							{
								let result = "<custom-page></custom-page>";

								if( $stateParams.slug === 'about-us' )
									result += "<paypal-donate></paypal-donate>";

								return result;
							}
						}


					}
			} )

		// ------------------------------------------------------- //
		// ------------------------------------------------------- //

		//
		.state( 'main.content',
			{
				abstract: true,

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
							templateProvider: function( $stateParams )
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
							templateProvider: function( $stateParams )
							{
								if( $stateParams.provider !== 'all' )
									return "<provider-detail-page></provider-detail-page>";

								return "" +
									"<provider-list-page></provider-list-page>";
							}
						}
					}
			} )

		// ------------------------------------------------------- //
		// ------------------------------------------------------- //

		//
		.state( 'main.login',
			{
				url: '/login',
				params: {
					registerMail: {
						value: null
					}
				},

				views:
					{
						'body@main': {
							templateUrl: getView( 'login/login' )
						}
					}
			} )

		//
		.state( 'main.register',
			{
				url: '/register',

				views:
					{
						'body@main': {
							templateUrl: getView( 'login/register' )
						}
					}
			} )

		//
		.state( 'main.forgotpassword',
			{
				url: '/forgot-password',
				data: {},

				views:
					{
						'body@main': {
							templateUrl: getView( 'login/forgot-password' )
						}
					}
			} )

		//
		.state( 'main.resetpassword',
			{
				url: '/reset-password/{token}',
				data: {},

				views:
					{
						'body@main': {
							templateUrl: getView( 'login/reset-password' )
						}
					}
			} )
}
