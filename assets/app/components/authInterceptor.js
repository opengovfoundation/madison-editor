'use strict';

angular.module('myApp').factory('authInterceptor', ['$location', function($location) {
	var authInterceptor = {
		responseError: function(response) {
			console.log('Responder', response);
			if (response.status === 401 || response.status === 403) {
				$location.url('/login');
				console.log('failure');
			}
			return response;
		}
	}
    return authInterceptor;
}])
