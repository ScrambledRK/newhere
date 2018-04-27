class FilterSelectorController
{
	constructor( FilterService,
	             $rootScope )
	{
		'ngInject';

		this.FilterService = FilterService;
		this.$rootScope = $rootScope;

		//
		this.filters = this.FilterService.filters;

		this.selected = [];
		this.dropFilter = [];

		//
		this.$rootScope.$on( "filterChanged", ( event, data ) =>
		{
			//if( !this.item )
			//	console.error("no filter item available! oh-nose");

			this.selected = this.item;
			this.onFilterChanged();
		} );
	}

	$onInit()
	{
		//;
	}

	//
	onFilterChanged()
	{
		this.FilterService.selectFilters( this.selected );

		//
		this.dropFilter.length = 0;

		angular.forEach( this.selected, ( filter, key ) =>
		{
			if( filter.parent_id )
			{
				let idx = filter.parent_id;

				if( !this.dropFilter[idx] )
					this.dropFilter[idx] = [];

				this.dropFilter[idx].push( filter );
			}
		} );
	}

	//
	toggleFilter( filter )
	{
		filter.selected = !filter.selected;

		//
		this.selected.length = 0;
		this.selected.push.apply( this.selected, this.FilterService.getSelectedFilters() );

		//
		angular.forEach( this.selected, ( filter, key ) =>
		{
			//console.log( "selected:", filter.slug, filter );
		} );
	}

	//
	inSelection( filter )
	{
		return filter.selected;
	}

}

/**
 *
 * @type {{template: *, controller: FilterSelectorController, controllerAs: string, bindings: {item: string}}}
 */
export const FilterSelectorComponent = {
	template: require('./filter-selector.component.html'),
	controller: FilterSelectorController,
	controllerAs: 'vm',
	bindings: {
		item: '=ngModel'
	}
};
