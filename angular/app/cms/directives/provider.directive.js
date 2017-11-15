export function ProviderDirective()
{
	'ngInject';

	let controller = ['$scope', function( $scope )
	{
		$scope.selectedItem = this.selectedItem = null;
		$scope.searchText = this.searchText = null;

		//
		$scope.querySearch = this.querySearch = function( text )
		{
			console.log( "search", text );

			if( !text || text === "" )
				return $scope.vm.providers;

			//
			text = text.trim().toLowerCase();

			//
			let qProviders = [];

			angular.forEach( $scope.vm.providers, ( item ) =>
			{
				let name = item.organisation.trim().toLowerCase();

				if( name.indexOf( text ) !== -1 )
					qProviders.push( item );
			} );

			if( qProviders.length === 0 )
				qProviders = $scope.vm.providers;

			return qProviders;
		};

		$scope.selectedItemChange = this.selectedItemChange = function( item )
		{
			console.log("selected:",item);

			if( item )
			{
				$scope.vm.query.ngo_id = item.id;
				$scope.vm.onQueryUpdate();
			}
			else
			{
				delete $scope.vm.query.ngo_id;
				$scope.vm.onQueryUpdate();
			}
		}
	}];

	return {
		scope: {
			vm : "="
		},
		restrict: 'EA',
		template: require( './provider.directive.html' ),
		controller: controller,
		controllerAs: 'ctrl'
	};
}
