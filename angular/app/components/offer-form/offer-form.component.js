class OfferFormController {
    constructor($http, $q, OfferService, ToastService, NgoService, CategoryService, $state, LanguageService) {
        'ngInject';

        this.$q = $q;
        this.aborter = $q.defer();

        this.categories = [];
        this.$http = $http;
        this.OfferService = OfferService;
        this.ToastService = ToastService;
        this.$state = $state;
        this.$LanguageService = LanguageService;
        this.NgoService = NgoService;
        if(this.cms){
          this.NgoService.fetchAll().then((list) => {
            this.ngos = list;
          });
        }
        this.CategoryService = CategoryService;
        this.CategoryService.all((list) => {
          this.categories = list;
        })
        this.categoriesOptions = {
          selectionChanged: (items) => {
            this.offer.categories = items;
          }
        }
        if($state.params.id){
          this.OfferService.one($state.params.id, (offer) =>{
            this.offer = offer;
            this.valid_from = new Date(this.offer.valid_from);
            this.valid_until = new Date(this.offer.valid_until);
          })
        }
        else{
          this.offer = {
            categories:[],
            filters:[]
          };
          this.valid_from = new Date();
        }

        angular.element(document.querySelector('#addressSearch')).$valid = false;
    }

    querySearch(query) {
        if (this.$http.pendingRequests.length) {
            this.aborter.resolve();
            this.aborter = this.$q.defer();
        }
        return this.$http.get('/api/offer/autocomplete/' + query, {
            timeout: this.aborter.promise
        }).then(function(response) {
            return response.data; // usually response.data
        });

    }

    selectedItemChange(item) {
        if (!item) return;
        this.offer.street = item.street;
        this.offer.streetnumber = item.number;
        this.offer.city = item.city;
        this.offer.zip = item.zip;
    }

    save() {
      if(!this.offer.street || !this.offer.streetnumber || !this.offer.zip ){
        this.ToastService.error('Es ist keine Adresse vorhanden!');
        return false;
      }

      this.offer.valid_until = this.valid_until;
      this.offer.valid_from = this.valid_from;
      this.OfferService.save(this.offer);

    }

    cancel() {
        this.OfferService.cancel(this.cms);
    }

}

export const OfferFormComponent = {
    templateUrl: './views/app/components/offer-form/offer-form.component.html',
    controller: OfferFormController,
    controllerAs: 'vm',
    bindings: {
        cms: '=',
        ngo: '='
    }
}