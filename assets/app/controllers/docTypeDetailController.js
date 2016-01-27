'use strict';

var app = angular.module('madisonEditor.controllers');

function DocTypeDetailController($scope, $http, $routeParams, $location,
  $timeout, $filter, growl, growlMessages) {
  $scope.form = {
    errors: {}
  };
  $scope.type = {};
  $scope.status = 'saved';
  $scope.copyId = null;
  if($routeParams['copy']) {
    $scope.copyId = $routeParams['copy'];
  }
  var self = this;
  this.$scope = $scope;
  this.$timeout = $timeout;

  this.get = function() {
    return $http.get("/api/doc-types/" + $routeParams.id);
  };

  this.save = function(newObject) {
    return $http.put('/api/doc-types/' + $scope.model.id, {type: newObject})
  };

  this.init('type');
}

DocTypeDetailController.prototype = Object.create(FormController.prototype);

app.controller('DocTypeDetailController',
  ['$scope', '$http', '$routeParams', '$location', '$timeout', '$filter',
  'growl', 'growlMessages', DocTypeDetailController]);
