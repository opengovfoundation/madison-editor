'use strict';

var app = angular.module("madisonEditor.auth", []);

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
    $http.post('/api/auth/local', {
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
        var url = '/';
        if($rootScope.returnTo)
        {
          url = $rootScope.returnTo;
        }
        $location.url(url);
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

app.controller('AuthLogoutController', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {

  var logout = function(){
    delete $rootScope.user;
    $location.url('/');
  };

  $http.get('/api/logout')
    .success(logout)
    .error(logout);
}]);
