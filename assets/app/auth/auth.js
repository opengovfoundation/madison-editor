'use strict';

var app = angular.module("myApp.auth", []);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'app/auth/login.html',
    controller: 'AuthLoginController'
  });
}]);

app.controller('AuthLoginController', function($scope, $rootScope, $http, $location) {
  $scope.user = {};

  $scope.doLogin = function(){
    $http.post('/auth/local', {
      email: $scope.user.email,
      password: $scope.user.password
    })
    .success(function(){
      $location.url('/');
    })
    .error(function(){
      $scope.error = 'The email and password combination you\'ve entered is incorrect.';
    });
  };
});
