export function CmsRoutesConfig( $stateProvider, $urlRouterProvider )
{
	'ngInject';

	let getViewCMS = ( viewName ) =>
	{
		return `./views/app/cms/${viewName}.page.html`;
	};

	$urlRouterProvider.otherwise( '/' );

	// ------------------------------------------ //
	// ------------------------------------------ //

	// $stateProvider
	// moved all to main routes for lazy loading of cms
}
