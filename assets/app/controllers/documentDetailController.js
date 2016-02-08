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

  /**
   * Relies on the `ep_post_message` plugin returning a `postMessage` with the
   * result of `getDocHeight` so we can set the height of the iframe.
   */
  setInterval(function() {
    $('iframe')[0].contentWindow.postMessage(JSON.stringify({
      callbackKey: '1234',
      method: 'getDocHeight'
    }), '*');
  }, 1000);

  window.addEventListener('message', function(event) {
    var data = JSON.parse(event.data);
    if (data && data.callbackKey === '1234') $('iframe').height(data.data + 167);
  });
}

DocumentDetailController.prototype = Object.create(FormController.prototype);

app.controller('DocumentDetailController',
  ['$scope', '$http', '$routeParams', '$location', '$timeout', '$filter',
    '$translate', 'growl', 'growlMessages', DocumentDetailController]);
