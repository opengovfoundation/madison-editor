'use strict';

var app = angular.module("myApp.documents", []);

//OPTIONAL! Set socket URL!
// app.config(['$sailsProvider', function ($sailsProvider) {
//     $sailsProvider.url = 'http://localhost:1337';
// }]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/documents', {
    templateUrl: 'documents/list.html',
    controller: 'DocumentListController'
  });
  $routeProvider.when('/documents/:slug', {
    templateUrl: 'documents/detail.html',
    controller: 'DocumentDetailController'
  });
}]);

app.controller("DocumentListController", function ($scope, $http, $routeParams, $location) {
  $scope.documents = [];
  console.log('list');
  $http.get("/api/docs/")
    .success(function (data) {
      $scope.documents = data.documents;
    })
    .error(function (data) {
      alert('Houston, we got a problem!');
    });

  $scope.newDocument = '';
  $scope.createDocument = function(){
    var doc = {document: {'title': 'Untitled'}};

    $http.post("/api/docs/", doc)
      .success(function (data) {
        console.log(data.document, data.document.id);
        $location.path('/documents/' + data.document.id);
      })
      .error(function (data) {
        alert('Houston, we got a problem!');
      });
  }
});

app.controller("DocumentDetailController", function ($scope, $http, $routeParams) {
  console.log('detail');
  $http.get("/api/docs/" + $routeParams.slug)
    .success(function (data) {
      $scope.document = data.document;
    })
    .error(function (data) {
      alert('Houston, we got a problem!');
    });
});
