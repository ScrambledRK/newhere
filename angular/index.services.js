import {APIService} from './services/API.service';
import {ToastService} from './services/toast.service';
import {SearchService} from './services/search.service';


angular.module('app.services')
	.service('API', APIService)
	.service('SearchService', SearchService)
	.service('ToastService', ToastService);
