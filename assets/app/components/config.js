'use strict';

// Configuration goes here.
var app = angular.module('madisonEditor.config', []);
app.factory('config', function() {
  return {
    etherpad: {
      url : '//localhost:9001'
    }
  };
});

// Config helpers
app.filter('etherpadUrl', ['$sce', 'config', function ($sce, config) {
  return function(slug, extraParams) {
    var url = config.etherpad.url + '/p/' + slug;
    if(extraParams['copy']) {
      url = config.etherpad.url + '/copy?old=' + extraParams['copy'] + '&new=' + slug;
    }
    return $sce.trustAsResourceUrl(url);
  };
}]);
