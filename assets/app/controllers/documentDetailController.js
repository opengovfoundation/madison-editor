'use strict';

var app = angular.module('madisonEditor.controllers');

function DocumentDetailController($scope, $http, $routeParams, $location,
  $timeout, $filter, $translate, growl, growlMessages) {

  $scope.form = {
    errors: {}
  };
  $scope.model = {};
  $scope.status = 'saved';
  $scope.copyId = null;
  $scope.types = [];
  $scope.publishStates = [];

  // We are hardcoding statuses for now.  In the future, get this via endpoint.
  var rawStates = ['published', 'private', 'unpublished'];
  for(var i in rawStates) {
    $scope.publishStates.push({
      'value': rawStates[i],
      'name': $translate.instant('form.document.publishstate.' + rawStates[i])
    });
  }

  if($routeParams.copy) {
    $scope.copyId = $routeParams.copy;
  }

  this.$scope = $scope;
  this.$timeout = $timeout;

  this.get = function() {
    return $http.get('/api/docs/' + $routeParams.id);
  };

  this.save = function(newObject) {
    return $http.put('/api/docs/' + $scope.model.id, newObject);
  };

  $http.get('/api/doc-types/').then(function(data) {
    $scope.types = data.data.types;
  });

  this.init();
}

DocumentDetailController.prototype = Object.create(FormController.prototype);

app.controller('DocumentDetailController',
  ['$scope', '$http', '$routeParams', '$location', '$timeout', '$filter',
    '$translate', 'growl', 'growlMessages', DocumentDetailController]);
