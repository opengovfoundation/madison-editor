'use strict';

var user;

// Declare app level module which depends on views, and components
angular.module('madisonEditor', [
  'angular-growl',
  'ngRoute',
  // 'ngResource',
  'madisonEditor.config',
  'madisonEditor.documents',
  'madisonEditor.auth'
])

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
}])

.run(function($rootScope) {
  $rootScope.user = user;
});

// We have to manually bootstrap our app because
// we want to get some data before we begin.
angular.element(document).ready(function() {
  var initInjector = angular.injector(["ng"]);
  var $http = initInjector.get("$http");

  // Get data about our user.
  $http.get('/api/users/current')
    .success(function(data) {
      user = data;
    })
    .finally(function() {
      angular.bootstrap(document, ['madisonEditor']);
    });
});
