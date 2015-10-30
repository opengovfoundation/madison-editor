'use strict';

angular.module('madisonEditor.translate', ['pascalprecht.translate'])

.config(function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/locales/',
    suffix: '.json'
  });
  // $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
  // $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  $translateProvider.usePostCompiling(true);
  $translateProvider.use('en_US');
});
