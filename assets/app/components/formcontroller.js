'use strict';

function FormController() {
  this.saveTimeout = false;
};

// Override this method.
FormController.prototype.get = function() {
  // Example implementation
  // return $http.get("/api/docs/" + $routeParams.id);
};

// Override this method.
FormController.prototype.save = function(newObject) {
  // Example implementation
  // return $http.put(this.saveUrl + $scope.document.id, {document: newObject})
};

/*
 * init()
 *
 * Does the initial get for data.
 */
FormController.prototype.init = function(obj) {
  var self = this;
  this.get()
    .success(function (data) {
      console.log('thisself', this, self);
      self.$scope.model = data;

      // Watch for changes to the entire document.
      self.$scope.$watch('model', self.debounceSaveUpdates.bind(self), true);
    })
    .error(function (data) {
      // TODO: Real error here.
      alert('Houston, we got a problem!');
    });
};

FormController.prototype.saveUpdates = function(newObject) {
  var self = this;
  this.save(newObject)
    .success(function (data) {
      if(data.error) {
        self.$scope.status = 'unsaved';
        self.$scope.form.errors = parseErrors(data.error);
      }
      else {
        self.$scope.status = 'saved';
      }
    })
    .error(function (data) {
      // TODO: Real error here.
      console.log(data);
      alert('Houston, we got a problem!');
    });
};

// Parse errors from the api into something usable.
FormController.prototype.parseErrors = function(errors) {
  var errorList = {};
  for(var field in errors.invalidAttributes) {
    for(var idx in errors.invalidAttributes[field]) {
      var error = errors.invalidAttributes[field][idx];

      if(field == 'docs_slug_unique') {
        field = 'slug';
      }

      if(!errorList[field]) {
        errorList[field] = [];
      }

      // We push on the rule name for translation.
      errorList[field].push( "form.document.errors." + field + "." + error.rule );
    }
  }

  for(var field in errorList) {
    errorList[field] = errorList[field].join("<br>");
  }

  return errorList;
}

// Debounce wrapper for updates.

FormController.prototype.debounceSaveUpdates = function(newObject, oldObject) {
  if (newObject !== oldObject) {
    console.log('changed doc', newObject);

    this.$scope.status = 'saving';

    if (this.saveTimeout) {
      this.$timeout.cancel(this.saveTimeout)
    }
    this.saveTimeout = this.$timeout(this.saveUpdates.bind(this, newObject), 1000, true);
    console.log('timeout', this.saveTimeout);
  }
};

var app = angular.module('madisonEditor.controllers', FormController);
