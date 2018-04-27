/**
 * angular ui-router responsible for the app state management
 * view, controller setup for each state and url navigation-bar
 *
 * @param $stateProvider
 * @param $urlRouterProvider
 * @constructor
 */
export function MainRoutesConfig( $stateProvider, $urlRouterProvider )
{
	'ngInject';

	let getView = ( viewName ) =>
	{
		return `./views/app/main/pages/${viewName}.page.html`;
	};

	let getViewCMS = ( viewName ) =>
	{
		return `./views/app/cms/${viewName}.page.html`;
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

				data: {
					title: "welcome",
				},

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
				url: '/offers/{category:[a-zA-Z0-9\-\,]+}/{offer:[0-9]*}',

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
							template: "<toolbar></toolbar>"
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

				data: {
					title: "Anmelden"
				},

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

				data: {
					title: "Registrieren"
				},

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

				data: {
					title: "Passwort vergessen?"
				},

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

				data: {
					title: "Passwort ändern"
				},

				views:
					{
						'body@main': {
							templateUrl: getView( 'login/reset-password' )
						}
					}
			} )

		// //////////////////////////////////////////////////////////////////////// //
		// //////////////////////////////////////////////////////////////////////// //
		// unfortunately ... to make the cms lazy load the state system has to be here

		//
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
								templateUrl: getViewCMS( 'components/header/header' )
							},

						footer:
							{
								templateUrl: getViewCMS( 'components/footer/footer' )
							}
					},

				lazyLoad: function( $transition$ )
				{
					let $ocLazyLoad = $transition$.injector().get( '$ocLazyLoad' );

					return $ocLazyLoad.load( window.newhere.cms[0] ).then( () =>
					{
						return $ocLazyLoad.load( window.newhere.cms[1] );
					});
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
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user'],
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
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user']
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
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user']
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
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user'],
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
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user']
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
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user']
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
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user'],
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
					roles: ['admin', 'superadmin']
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
					roles: ['admin', 'superadmin']
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
					roles: ['admin', 'superadmin', 'organisation-admin', 'organisation-user'],
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
					roles: ['admin', 'superadmin'],
					title: "Kategorien"
				},

				views: {
					'body@cms': {
						template: "<cms-category-form></cms-category-form>"
					}
				}
			} )

		//
		.state( 'cms.content',
			{
				url: '/content',

				data: {
					auth: true,
					roles: ['admin', 'superadmin'],
					title: "Content"
				},

				views: {
					'body@cms': {
						template: "<cms-provider-tasks></cms-provider-tasks>"
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
					roles: ['admin', 'superadmin'],
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
					roles: ['admin', 'superadmin']
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
					roles: ['admin', 'superadmin']
				},

				views: {
					'body@cms': {
						template: "<cms-page-form></cms-page-form>"
					}
				}
			} )
}
