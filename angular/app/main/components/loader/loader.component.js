class LoaderController
{
	constructor()
	{
		'ngInject';
		//
	}
}

//
export const LoaderComponent = {
	template: require( './loader.component.html' ),
	controller: LoaderController,
	controllerAs: 'vm',
	bindings: {
		condition: '='
	}
};