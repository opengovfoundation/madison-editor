'use strict';

var app = angular.module('madisonEditor.controllers');

//OPTIONAL! Set socket URL!
// app.config(['$sailsProvider', function ($sailsProvider) {
//     $sailsProvider.url = 'http://localhost:1337';
// }]);

app.controller('DocumentListController', [
  '$scope', '$http', '$routeParams', '$location', '$translate', 'growl', 'growlMessages',
  function ($scope, $http, $routeParams, $location, $translate, growl, growlMessages) {

  $scope.documents = [];
  $http.get("/api/docs/")
    .success(function (data) {
      $scope.documents = data.documents;
    })
    .error(function (data) {
      alert('Houston, we got a problem!');
    });
  $http.get("/api/docs/", {'params': {'is_template': 1}})
    .success(function (data) {
      $scope.templates = data.documents;
    })
    .error(function (data) {
      alert('Houston, we got a problem!');
    });

  $scope.showForm = false;
  $scope.showCreateForm = function(){
    $scope.showForm = true;
  };
  $scope.hideCreateForm = function(){
    $scope.showForm = false;
  };

  $scope.newDocument = '';
  $scope.createDocument = function(copyDocument){
    var doc = {};
    if(copyDocument && copyDocument.title) {
      doc.title = $translate.instant('documents.list.new', {title: copyDocument.title});
    }
    else {
      doc.title = $translate.instant('documents.list.new.blank');
    }

    $http.post("/api/docs/", doc)
      .success(function (data) {
        if(copyDocument) {
          $location.path('/documents/' + data.document.id)
            .search({'copy': copyDocument.id});
        }
        else {
          $location.path('/documents/' + data.document.id);
        }

      })
      .error(function (data) {
        // TODO -
        // growl.error(data.error);
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

    $http.delete("/api/docs/" + doc.id)
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

}]);
