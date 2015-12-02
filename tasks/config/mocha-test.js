/**
*	Mocha *server-side* test runner
*/

module.exports = function (grunt) {
	
	grunt.config.set('mocha-test', {
		dev: {
			options: {},
			src: ['test/**/*']
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');
}