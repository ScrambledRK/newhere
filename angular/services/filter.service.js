export class FilterService
{
	/**
	 *
	 * @param {*} API
	 * @param {*} $translate
	 * @param {*} $rootScope
	 */
	constructor( API,
	             $translate,
	             $rootScope,
	             $q )
	{
		'ngInject';

		this.API = API;
		this.$translate = $translate;
		this.$rootScope = $rootScope;
		this.$q = $q;

		//
		this.filters = [];

		//
		this.$rootScope.$on( "languageChanged", ( event, data ) =>
		{
			this.onLanguageChanged();
		} );

		//
		this.fetchFilters();
	}

	/**
	 *
	 */
	onLanguageChanged()
	{
		this.fetchFilters();
	}

	/**
	 * @returns {*|{promise}}
	 */
	fetchFilters()
	{
		return this.API.all( 'cms/filters' ).getList()
			.then( ( response ) =>
				{
					let selected = this.getSelectedFilters();

					this.filters.length = 0;
					this.filters.push.apply( this.filters, response );

					//
					this.selectFilters( selected );

					//
					this.$rootScope.$broadcast( 'filterChanged', this );
				},
				( error ) =>
				{
					throw error;
				} )
		;
	}

	//
	selectFilters( selectedList, targetList )
	{
		if( !targetList )
			targetList = this.filters;

		//
		angular.forEach( targetList, ( filter, key ) =>
		{
			filter.selected = false;

			if( filter.children && filter.children.length > 0 )
				this.selectFilters( selectedList, filter.children );
		} );

		//
		angular.forEach( selectedList, ( selection, key ) =>
		{
			let index = this.indexOf( selection.id, targetList );

			if( index > -1 )
				targetList[index].selected = true;
		} );
	}

	//
	getSelectedFilters( targetList, result )
	{
		if( !targetList )
			targetList = this.filters;

		if( !result )
			result = [];

		//
		let selected = result;

		angular.forEach( targetList, ( filter, key ) =>
		{
			if( filter.selected )
				selected.push( filter );

			if( filter.children && filter.children.length > 0 )
				this.getSelectedFilters( filter.children, selected );
		} );

		return selected;
	}

	// -------------------------------------------------------------- //
	// -------------------------------------------------------------- //

	//
	indexOf( filterID, targetList )
	{
		if( !targetList )
			targetList = this.filters;

		//
		let result = -1;

		angular.forEach( targetList, ( filter, index ) =>
		{
			if( filter.id === filterID )
				result = index;
		} );

		return result;
	}
}
