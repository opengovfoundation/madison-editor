/**
 * SimpleMocha **server-side** test runner
 *
 * ---------------------------------------------------------------
 *
 * Run the mocha test runner for our test suite
 *
 * For usage docs see:
 * 		https://github.com/yaymukund/grunt-simple-mocha
 *
 */

module.exports = function (grunt) {
	
	grunt.config.set('simplemocha', {
		dev: {
			// options: {
			// 	reporter: 'spec'
			// },
			all: {
				src: ['test/**/*']
			}
		}
	});

	grunt.loadNpmTasks('grunt-simple-mocha');
};