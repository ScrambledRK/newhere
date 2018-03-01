/**
 *
 */
export function ScrollDirective($window) {
	'ngInject';

	return {
		scope:
			{
				onScroll: '='
			},

		link: function( scope, element, attr )
		{
			angular.element( $window ).bind( "scroll", function( event )
			{
				//console.log("aaaaa");

				scope.$apply( function()
				{
					//console.log("bbbbb");
					scope.onScroll();
				} );
			} );
		}
	};
}
