class CategoryFormController
{
	constructor( CategoryService,
	             ToastService,
	             PageService,
	             API,
	             $rootScope,
	             $scope )
	{
		'ngInject';

		this.API = API;
		this.ToastService = ToastService;
		this.CategoryService = CategoryService;
		this.PageService = PageService;
		this.$rootScope = $rootScope;
		this.$scope = $scope;

		//
		this.$scope.category = this.category = this.CategoryService.category;
		this.$scope.pages = this.pages = this.PageService.pages;

		// ---------------------- //
		// ---------------------- //

		//
		let onCategories = this.$rootScope.$on( "categoriesChanged", ( event, data ) =>
		{
			this.$scope.category = this.category = this.CategoryService.category;
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
		this.PageService.all();

		this.isSaveDisabled = true;
		this.changeList = [];
	}

	//
	onCategoriesChanged()
	{
		this.setupCategories( this.category );
	}

	//
	setupCategories( node )
	{
		if( !node )
			return;

		node.isExpanded = false;
		node.isSelected = false;

		//
		angular.forEach( node.all_children, ( child, key ) =>
		{
			this.setupCategories( child );
		} );
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	//
	toggleExpansion( category, node )
	{
		category.isExpanded = !category.isExpanded;
		node.toggle();
	}

	//
	onSelectedPageChanged( category )
	{
		this.isSaveDisabled = false;
		this.changeList.push( category );
	}

	//
	save()
	{
		this.CategoryService.updateList( this.changeList )
			.then( ( success ) =>
				{
					this.ToastService.show(
						sprintf( '%d Einträge aktualisiert.', this.changeList.length ) );

					this.changeList.length = 0;
					this.isSaveDisabled = true;
				},
				( error ) =>
				{
					this.ToastService.error( 'Fehler beim aktualisieren der Einträge.' );

					this.changeList.length = 0;
					this.isSaveDisabled = true;

					this.CategoryService.fetchCategories();
				}
			);
	}
}

/**
 *
 * @type {{template: *, controller: CategoryFormController, controllerAs: string, bindings: {item: string, category: string}}}
 */
export const CategoryFormComponent = {
	template: require('./category-form.component.html'),
	controller: CategoryFormController,
	controllerAs: 'vm',
	bindings: {
		item: '=ngModel',
		category: '<'
	}
};
