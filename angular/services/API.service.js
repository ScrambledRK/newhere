export class APIService
{
	constructor( Restangular,
	             ToastService,
	             $rootScope,
	             $window )
	{
		'ngInject';

		var headers = {
			'Content-Type': 'application/json',
			'Accept': 'application/x.laravel.v1+json'
		};

		return Restangular.withConfig( function( RestangularConfigurer )
		{
			RestangularConfigurer
				.setBaseUrl( '/api/' )
				.setDefaultHeaders( headers )
				.setErrorInterceptor( function( response )
				{
					if( response.status === 422 )
					{
						for( var error in response.data.errors )
						{
							return ToastService.error( response.data.errors[error][0] );
						}
					}
				} )
				.addFullRequestInterceptor( function( element, operation, what, url, headers )
				{
					let token = $window.localStorage.satellizer_token;

					if( token )
						headers.Authorization = 'Bearer ' + token;

					headers.Language = $rootScope.language || 'en';
				} )
				.addResponseInterceptor( function( data, operation, what, url )
				{
					let extractedData;

					if( operation === "getList" )
					{
						//console.log( what, url );
						extractedData = data.data["result"];

						if( data.data['count'] )
						{
							extractedData.count = data.data['count'];
						}

						extractedData.error = data.errors;
					}
					else
					{
						extractedData = data;
					}
					return extractedData;
				} );
		} );
	}
}
