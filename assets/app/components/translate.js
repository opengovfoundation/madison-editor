'use strict';

angular.module('madisonEditor.translate', ['pascalprecht.translate'])

.config(function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/locales/',
    suffix: '.json'
  });
  $translateProvider.use('en_US');
});
