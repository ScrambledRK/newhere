class CategorySelectorController
{
	constructor( CategoryService,
	             $rootScope,
	             $scope )
	{
		'ngInject';

		this.CategoryService = CategoryService;
		this.$rootScope = $rootScope;
		this.$scope = $scope;

		//
		this.$scope.category = this.category = this.CategoryService.category;
		this.selected = [];

		// ---------------------- //
		// ---------------------- //

		//
		let onCategories = this.$rootScope.$on( "categoriesChanged", ( event, data ) =>
		{
			if( !this.item )
				console.error("no category item available! oh-nose");

			this.$scope.category = this.category = this.CategoryService.category;
			this.selected = this.item;

			this.onCategoriesChanged();
		} );

		//
		this.$scope.$on( '$destroy', () =>
		{
			onCategories();
		} );
	}

	$onInit()
	{
		//;
	}

	//
	onCategoriesChanged()
	{
		this.setupCategories( this.category );

		//console.log( this.category );
		//console.log( this.selected );
	}

	//
	setupCategories( node )
	{
		if( !node )
			return;

		node.isExpanded = true;
		node.isSelected = false;

		//
		angular.forEach( node.all_children, ( child, key ) =>
		{
			this.setupCategories( child );
		} );

		//
		angular.forEach( this.selected, ( category, key ) =>
		{
			if( node.id === category.id )
			{
				node.isSelected = true;

				//
				let parent = node.parent;

				while( parent )
				{
					parent.isExpanded = true;
					parent = parent.parent;
				}
			}
		} );
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	toggleExpansion( category, node )
	{
		//console.log( "t:", category, node );

		category.isExpanded = !category.isExpanded;
		node.toggle();
	}

	toggleSelection( category )
	{
		if( category.all_children && category.all_children.length > 0 ) // only leaf nodes allowed
			return;

		//
		let index = this.indexOf( category.id );

		if( !category.isSelected )  // toggled by checkbox after click event >_>
		{
			if( index === -1 )
				this.selected.push( {id:category.id} );
		}
		else
		{
			if( index > -1 )
				this.selected.splice( index );
		}

		//console.log( this.selected );
	}

	//
	indexOf( categoryID, targetList )
	{
		if( !targetList )
			targetList = this.selected;

		//
		let result = -1;

		angular.forEach( targetList, ( category, index ) =>
		{
			if( category.id === categoryID )
				result = index;
		} );

		return result;
	}
}

/**
 *
 * @type {{template: *, controller: CategorySelectorController, controllerAs: string, bindings: {item: string}}}
 */
export const CategorySelectorComponent = {
	template: require('./category-selector.component.html'),
	controller: CategorySelectorController,
	controllerAs: 'vm',
	bindings: {
		item: '=ngModel',
		category: '<'
	}
};
