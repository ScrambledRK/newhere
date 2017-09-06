import {APIService} from './services/API.service';
import {ToastService} from './services/toast.service';
import {SearchService} from './services/search.service';
import {LanguageService} from './services/language.service';
import {CategoryService} from './services/category.service';
import {MapService} from './services/map.service';

angular.module('app.services')
	.service('API', APIService)
	.service('SearchService', SearchService)
	.service('ToastService', ToastService)
	.service('LanguageService', LanguageService)
	.service('CategoryService', CategoryService)
	.service('MapService', MapService)
;
