module.exports = function (grunt) {
  grunt.config.set('compass', {
    prod: {
      options: {
        importPath: [
          'assets/bower_components/compass-breakpoint/stylesheets',
          'assets/bower_components/bootstrap-sass-official/assets/stylesheets',
          'assets/bower_components/font-awesome/scss',
        ],
        sassDir: 'assets/scss',
        cssDir: 'assets/css',
        environment: 'prod'
      }
    },
    dev: {
      options: {
        importPath: [
          'assets/bower_components/compass-breakpoint/stylesheets',
          'assets/bower_components/bootstrap-sass-official/assets/stylesheets',
          'assets/bower_components/font-awesome/scss',
        ],
        sassDir: 'assets/scss',
        cssDir: 'assets/css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
};
