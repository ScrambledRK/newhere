class MapController{
    constructor(MapService, OfferService, $scope, $state){
        'ngInject';
        var vm = this;
        this.MapService = MapService;
        this.OfferService = OfferService;
        this.$state = $state;

        $scope.$on("leafletDirectiveMarker.click", function(event, args){
           vm.$state.go('app.start.detail', {id:args.model.offer_id});
         });

         $scope.$on("leafletDirectiveMarker.touchend", function(event, args){
            vm.$state.go('app.start.detail', {id:args.model.offer_id});
          });

    }

}

export const MapComponent = {
    templateUrl: './views/app/components/map/map.component.html',
    controller: MapController,
    controllerAs: 'vm',
    bindings: {}
}
