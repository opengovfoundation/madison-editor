'use strict';

// Configuration goes here.
var app = angular.module('myApp.config', []);
app.factory('config', function() {
  return {
    etherpad: {
      url : '//localhost:9001'
    }
  };
});

// Config helpers
app.filter('etherpadUrl', ['$sce', 'config', function ($sce, config) {
    return function(slug) {
        return $sce.trustAsResourceUrl(config.etherpad.url + '/p/' + slug);
    };
}]);
