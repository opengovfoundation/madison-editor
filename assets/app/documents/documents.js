'use strict';

var app = angular.module("madisonEditor.documents", ['madisonEditor.config']);

//OPTIONAL! Set socket URL!
// app.config(['$sailsProvider', function ($sailsProvider) {
//     $sailsProvider.url = 'http://localhost:1337';
// }]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/documents', {
    templateUrl: 'app/documents/list.html',
    controller: 'DocumentListController'
  });
  $routeProvider.when('/documents/:slug', {
    templateUrl: 'app/documents/detail.html',
    controller: 'DocumentDetailController'
  });
}]);

app.controller("DocumentListController", function ($scope, $http, $routeParams, $location) {
  $scope.documents = [];
  $http.get("/api/docs/")
    .success(function (data) {
      $scope.documents = data.documents;
    })
    .error(function (data) {
      alert('Houston, we got a problem!');
    });

  $scope.showForm = false;
  $scope.title = 'Untitled Document';
  $scope.showCreateForm = function(){
    $scope.showForm = true;
  };

  $scope.newDocument = '';
  $scope.createDocument = function(){
    if(!$scope.title){
      $scope.title = 'Untitled Document';
    }
    var doc = {document: {'title': $scope.title}};

    $http.post("/api/docs/", doc)
      .success(function (data) {
        $location.path('/documents/' + data.document.slug);
      })
      .error(function (data) {
        alert('Houston, we got a problem!');
      });
  }

  $scope.deleteConfirmOpen = [];

  $scope.openDeleteConfirm = function(doc) {
    $scope.deleteConfirmOpen[doc.id] = true;
  }

  $scope.closeDeleteConfirm = function(doc) {
    $scope.deleteConfirmOpen[doc.id] = false;
  }

  $scope.deleteDocument = function(doc) {

    $scope.closeDeleteConfirm(doc);

    $http.delete("/api/docs/" + doc.slug)
      .success(function (data) {
        // We've successfully deleted the document from the server.
        // Now we need to find that document and remove it from the page.
        var idx = 0;
        for(idx in $scope.documents) {
          var currentDoc = $scope.documents[idx];
          if(currentDoc === doc) {
            break;
          }
        }

        $scope.documents.splice(idx, 1);
      })
      .error(function (data) {
        alert('Houston, we got a problem!');
      });
  }

});

app.controller("DocumentDetailController", function ($scope, $http, $routeParams) {
  $http.get("/api/docs/" + $routeParams.slug)
    .success(function (data) {
      $scope.document = data.document;

      // Watch for changes to the title.
      $scope.$watch('document.title', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          $http.put("/api/docs/" + $scope.document.slug, {document: {title: newVal}})
            .success(function (data) {
              // Do nothing?
            })
            .error(function (data) {
              alert('Houston, we got a problem!');
            });
        }
      });
    })
    .error(function (data) {
      alert('Houston, we got a problem!');
    });
});
