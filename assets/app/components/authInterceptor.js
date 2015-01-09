angular.module('myApp').factory('authInterceptor', ['$location', function($location) {
	console.log('intercepted');
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
