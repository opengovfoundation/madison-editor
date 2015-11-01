'use strict';

var app = angular.module("madisonEditor.users", ['madisonEditor.config']);

//OPTIONAL! Set socket URL!
// app.config(['$sailsProvider', function ($sailsProvider) {
//     $sailsProvider.url = 'http://localhost:1337';
// }]);

app.controller("UserListController", [
  '$scope', '$http', '$routeParams', '$location', 'growl', 'growlMessages',
  function ($scope, $http, $routeParams, $location, growl, growlMessages) {

  $scope.documents = [];
  $http.get("/api/users/")
    .success(function (data) {
      $scope.documents = data.documents;
    })
    .error(function (data) {
      alert('Houston, we got a problem!');
    });

  $scope.title = 'Untitled Document';

  $scope.showForm = false;
  $scope.showCreateForm = function(){
    $scope.showForm = true;
  };
  $scope.hideCreateForm = function(){
    $scope.showForm = false;
  };

  $scope.newUser = '';
  $scope.create = function(type){

    var doc = {user: {}};

    $http.post("/api/users/", user)
      .success(function (data) {
        $location.path('/users/' + data.user.id);
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

  $scope.delete = function(doc) {

    $scope.closeDeleteConfirm(doc);

    $http.delete("/api/users/" + doc.id)
      .success(function (data) {
        // We've successfully deleted the user from the server.
        // Now we need to find that user and remove it from the page.
        var idx = 0;
        for(idx in $scope.users) {
          var currentDoc = $scope.users[idx];
          if(currentDoc === doc) {
            break;
          }
        }

        $scope.users.splice(idx, 1);
      })
      .error(function (data) {
        alert('Houston, we got a problem!');
      });
  }

}]);

app.controller("UserDetailController",
  ['$scope', '$http', '$routeParams', '$location', '$timeout', '$filter', 'growl', 'growlMessages',
  function ($scope, $http, $routeParams, $location, $timeout, $filter, growl, growlMessages) {
    $scope.form = {
      errors: {}
    };
    $scope.user = {};
    $scope.status = 'saved';

    // Does the actual saving.
    var saveUpdates = function(newUser, b, c) {
      console.log('save', newUser, b, c);
      $http.put("/api/docs/" + $scope.user.id, {user: newUser})
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
          errorList[field].push( "form.user.errors." + field + "." + error.rule );
        }
      }

      for(var field in errorList) {
        errorList[field] = errorList[field].join("<br>");
      }

      return errorList;
    }

    // Debounce wrapper for updates.
    var timeout;
    var debounceSaveUpdates = function(newUser, oldUser) {
      if (newUser !== oldUser) {
        console.log('changed doc', newUser);

        $scope.status = 'saving';
        console.log('timeout', timeout);
        if (timeout) {
          $timeout.cancel(timeout)
        }
        timeout = $timeout(saveUpdates.bind(null, newUser), 1000, true);
        console.log('timeout', timeout);
      }
    };

    $http.get("/api/docs/" + $routeParams.id)
      .success(function (data) {
        $scope.user = data.user;

        // Watch for changes to the entire user.
        $scope.$watch('user', debounceSaveUpdates, true);
      })
      .error(function (data) {
        alert('Houston, we got a problem!');
      });
  }
]);
