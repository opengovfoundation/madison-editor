module.exports = function (grunt) {
	grunt.config.set('compass', {
		prod: {
			options: {
				importPath: ['bower_components/bootstrap-sass-official/assets/stylesheets/'],
				sassDir: 'assets/scss',
				cssDir: 'assets/css',
				environment: 'prod'
			}
		},
		dev: {
			options: {
				importPath: ['bower_components/bootstrap-sass-official/assets/stylesheets/'],
				sassDir: 'assets/scss',
				cssDir: 'assets/css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
};
