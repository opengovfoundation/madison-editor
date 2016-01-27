'use strict';

var app = angular.module("madisonEditor.controllers");

app.controller('DocTypeListController', [
  '$scope', '$http', '$routeParams', '$location', '$translate', 'growl',
  'growlMessages',
  function ($scope, $http, $routeParams, $location, $translate, growl,
    growlMessages) {

  $scope.types = [];
  $scope.newType = {};

  $http.get("/api/doc-types/")
    .success(function (data) {
      $scope.types = data.types;
    })
    .error(function (data) {
      growl.Error('There was an error getting the document types.');
    });

  $scope.showForm = false;
  $scope.showCreateForm = function(){
    $scope.showForm = true;
  };
  $scope.hideCreateForm = function(){
    $scope.showForm = false;
  };

  $scope.createType = function(){
    if(!$scope.newType.name) {
        growl.error($translate.instant('form.type.error.name.missing'));
    }

    $http.post("/api/doc-types/", {type: $scope.newType})
      .success(function (data) {
        $location.path('/doc-types/' + data.type.id);
      })
      .error(function (data) {
        growl.error($translate.instant(data.error));
      });
  }

  $scope.deleteConfirmOpen = [];

  $scope.openDeleteConfirm = function(docType) {
    $scope.deleteConfirmOpen[docType.id] = true;
  }

  $scope.closeDeleteConfirm = function(docType) {
    $scope.deleteConfirmOpen[docType.id] = false;
  }

  $scope.deleteType = function(docType) {

    $scope.closeDeleteConfirm(docType);

    $http.delete("/api/doc-type/" + docType.id)
      .success(function (data) {
        // We've successfully deleted the DocType from the server.
        // Now we need to find that DocType and remove it from the page.
        var idx = 0;
        for(idx in $scope.DocTypes) {
          var currentDoc = $scope.DocTypes[idx];
          if(currentDoc === doc) {
            break;
          }
        }

        $scope.DocTypes.splice(idx, 1);
      })
      .error(function (data) {
        alert('Houston, we got a problem!');
      });
  }

}]);
