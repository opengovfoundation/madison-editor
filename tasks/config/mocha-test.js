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
	
	grunt.config.set('mochaTest', {
		dev: {
			// options: {
			// 	reporter: 'spec'
			// },
			src: ['test/**/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');
};