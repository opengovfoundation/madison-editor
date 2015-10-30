'use strict';

var app = angular.module("madisonEditor.documents", ['madisonEditor.config']);

//OPTIONAL! Set socket URL!
// app.config(['$sailsProvider', function ($sailsProvider) {
//     $sailsProvider.url = 'http://localhost:1337';
// }]);

app.controller("DocumentListController", [
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
    if(copyDocument.title) {
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

app.controller("DocumentDetailController",
  ['$scope', '$http', '$routeParams', '$location', '$timeout', '$filter', 'growl', 'growlMessages',
  function ($scope, $http, $routeParams, $location, $timeout, $filter, growl, growlMessages) {
    $scope.form = {
      errors: {}
    };
    $scope.document = {};
    $scope.status = 'saved';
    $scope.copyId = null;
    if($routeParams['copy']) {
      $scope.copyId = $routeParams['copy'];
    }

    // Does the actual saving.
    var saveUpdates = function(newDocument, b, c) {
      console.log('save', newDocument, b, c);
      $http.put("/api/docs/" + $scope.document.id, {document: newDocument})
        .success(function (data) {
          if(data.error) {
            $scope.status = 'unsaved';
            $scope.form.errors = parseErrors(data.error);

            console.log($scope.form.errors);
          }
          else {
            $scope.status = 'saved';
          }
        })
        .error(function (data) {
          console.log(data);
          alert('Houston, we got a problem!');
        });
    };

    // Parse errors from the api into something usable.
    var parseErrors = function(errors) {
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
    var timeout;
    var debounceSaveUpdates = function(newDocument, oldDocument) {
      if (newDocument !== oldDocument) {
        console.log('changed doc', newDocument);

        $scope.status = 'saving';
        console.log('timeout', timeout);
        if (timeout) {
          $timeout.cancel(timeout)
        }
        timeout = $timeout(saveUpdates.bind(null, newDocument), 1000, true);
        console.log('timeout', timeout);
      }
    };

    $http.get("/api/docs/" + $routeParams.id)
      .success(function (data) {
        $scope.document = data.document;

        // Watch for changes to the entire document.
        $scope.$watch('document', debounceSaveUpdates, true);
      })
      .error(function (data) {
        alert('Houston, we got a problem!');
      });
  }
]);
