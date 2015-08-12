'use strict';

var app = angular.module("myApp.auth", []);

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

app.controller('AuthLoginController', ['$scope', '$rootScope', '$http', '$location', 'growl',
  function($scope, $rootScope, $http, $location, growl) {

  $scope.login = {};
  $scope.error = false;

  $scope.doLogin = function(){
    $http.post('/auth/local', {
      email: $scope.login.email,
      password: $scope.login.password
    })
    .success(function(data, status){
      if(status !== 200) {
        $scope.error = 'The email and password combination you\'ve entered is incorrect.';
        growl.error($scope.error);
        console.log($scope.error);
      }
      else {
        $rootScope.user = data;
        console.log('Login data', data);
        $location.url('/');
      }
    })
    .error(function(){
      console.log('error');
      $scope.error = 'The email and password combination you\'ve entered is incorrect.';
      growl.error($scope.error);
      console.log($scope.error);
    });
  };
}]);

app.controller('AuthLogoutController', function($scope, $rootScope, $http, $location) {

  var logout = function(){
    $location.url('/');
    delete $rootScope.user;
  };

  $http.get('/logout')
    .success(logout)
    .error(logout);
});
