'use strict';

angular.module('madisonEditor.routes', [])

.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/login', {
    templateUrl: '/app/auth/login.html',
    controller: 'AuthLoginController'
  })
  .when('/logout', {
    template: ' ',
    controller: 'AuthLogoutController'
  })
  .when('/documents', {
    templateUrl: '/app/documents/list.html',
    controller: 'DocumentListController'
  })
  .when('/documents/:id', {
    templateUrl: '/app/documents/detail.html',
    controller: 'DocumentDetailController'
  })
  .otherwise({redirectTo: '/documents'});

  // use the HTML5 History API
  $locationProvider.html5Mode(true);
})

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}]);
