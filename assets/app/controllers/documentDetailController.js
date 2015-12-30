'use strict';

var app = angular.module("madisonEditor.controllers", ['madisonEditor.config']);

function DocumentDetailController($scope, $http, $routeParams, $location,
  $timeout, $filter, growl, growlMessages) {

  $scope.form = {
    errors: {}
  };
  $scope.model = {};
  $scope.status = 'saved';
  $scope.copyId = null;
  if($routeParams['copy']) {
    $scope.copyId = $routeParams['copy'];
  }
  var self = this;
  this.$scope = $scope;
  this.$timeout = $timeout;

  this.get = function() {
    return $http.get('/api/docs/' + $routeParams.id);
  };

  this.save = function(newObject) {
    return $http.put('/api/docs/' + $scope.model.id, newObject);
  };

  this.init();
}

DocumentDetailController.prototype = Object.create(FormController.prototype);

app.controller("DocumentDetailController",
  ['$scope', '$http', '$routeParams', '$location', '$timeout', '$filter',
    'growl', 'growlMessages', DocumentDetailController]);
