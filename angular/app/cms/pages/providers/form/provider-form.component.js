class ProviderFormController
{
	constructor( $rootScope,
	             $scope )
	{
		'ngInject';

		this.$rootScope = $rootScope;
		this.$scope = $scope;

		//
		if( !this.buttons )
			this.buttons = true;

		//
		let onSave = this.$rootScope.$on( "createProvider", ( event ) =>
		{
			this.save();
		} );

		this.$scope.$on( '$destroy', () =>
		{
			onSave();
		} );
	}

	save()
	{
		console.log("save that ass");
	}
}

export const ProviderFormComponent = {
	template: require( './provider-form.component.html' ),
	controller: ProviderFormController,
	controllerAs: 'vm',
	bindings: {
		buttons: '=buttons'
	}
};
