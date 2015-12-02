/**
 * Mocha **server-side** test runner
 *
 * ---------------------------------------------------------------
 *
 * Run the mocha test runner for our test suite
 *
 * For usage docs see:
 * 		https://github.com/pghalliday/grunt-mocha-test
 *
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