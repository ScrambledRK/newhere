class FilterSelectorController{
    constructor(FilterService){
        'ngInject';

        //
        this.selectedFilter = [];
        this.dropdownFilters = {};
        this.filters = [];
        this.FilterService = FilterService;
        this.FilterService.all((list) => {
          this.filters = list;
          if(this.item){
            this.selectedFilter = angular.copy(this.item);
            angular.forEach(this.selectedFilter, (filter, key) =>{
              if(filter.parent_id){
                this.dropdownFilters[filter.slug] = filter;
              }
            });
            console.log(this.selectedFilter);
            console.log(this.dropdownFilters);
          }

        });

    }
    toggleFilter(filter){
      if(filter.parent_id){
        angular.forEach(this.selectedFilter, (f, key) =>{
          if(f.parent_id == filter.parent_id){
            this.selectedFilter.splice(key,1);
          }
        });
        this.selectedFilter.push(filter);
      }
      else{
        let idx = null;
        angular.forEach(this.selectedFilter, (f, key) =>{
          if(f.id == filter.id){
            idx = key;
          }
        });
        if(idx){
           this.selectedFilter.splice(idx, 1);
        }
        else{
          this.selectedFilter.push(filter);
        }
      }
      this.item = this.selectedFilter;
    }
    inSelection(filter){
      let found = false;
      angular.forEach(this.selectedFilter, (f, key) =>{
        if(f.id == filter.id){
        found = true;
        }
      });
      if(found){
        return true;
      }
      return false;
    }
    $onInit(){

    }
}

export const FilterSelectorComponent = {
    templateUrl: './views/app/components/filter-selector/filter-selector.component.html',
    controller: FilterSelectorController,
    controllerAs: 'vm',
    bindings: {
      item:'=ngModel'
    }
}
