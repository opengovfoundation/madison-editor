'use strict';

var app = angular.module("myApp.auth", ['ngCookies']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'app/auth/login.html',
    controller: 'AuthLoginController'
  });
  $routeProvider.when('/logout', {
    template: ' ',
    controller: 'AuthLogoutController'
  });
}]);

app.controller('AuthLoginController', function($scope, $cookies, $http, $location) {
  $scope.login = {};

  $scope.doLogin = function(){
    $http.post('/auth/local', {
      email: $scope.login.email,
      password: $scope.login.password
    })
    .success(function(data){
      $rootScope.user = data.user;
      console.log('Login data', data);
      $location.url('/');
    })
    .error(function(){
      $scope.error = 'The email and password combination you\'ve entered is incorrect.';
    });
  };
});

app.controller('AuthLogoutController', function($scope, $cookies, $http, $location) {

  var logout = function(){
    $location.url('/');
    delete $rootScope.user;
  };

  $http.get('/logout')
    .success(logout)
    .error(logout);
});
