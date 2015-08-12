'use strict';

var user;

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'angular-growl',
  'ngRoute',
  // 'ngResource',
  'myApp.config',
  'myApp.documents',
  'myApp.auth'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/documents'});
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}])
.config(['growlProvider', function(growlProvider) {
  growlProvider.globalTimeToLive(5000);
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
      angular.bootstrap(document, ['myApp']);
    });
});
