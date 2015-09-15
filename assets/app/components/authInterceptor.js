'use strict';

angular.module('madisonEditor').factory('authInterceptor', ['$location', '$rootScope', function($location, $rootScope) {
  var authInterceptor = {
    responseError: function(response) {
      if (response.status === 401 || response.status === 403) {
        if($location.path() !== '/login')
        {
          $rootScope.returnTo = $location.path();
        }
        $location.url('/login');
      }
      return response;
    }
  }
    return authInterceptor;
}])
