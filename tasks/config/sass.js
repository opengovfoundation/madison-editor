module.exports = function (grunt) {
	grunt.config.set('sass', {
		dev: {
			options: {
				style: 'expanded' //Set your prefered style for development here.
			},
			files: [{
				expand: true,
				cwd: 'assets/scss/',
				src: ['*.scss', '*.sass'], // Feel free to remove a format if you do not use it.
				dest: '.tmp/public/css/',
				ext: '.css'
			}, {
				expand: true,
				cwd: 'assets/linker/scss/',
				src: ['*.scss', '*.sass'], // Feel free to remove a format if you do not use it.
				dest: '.tmp/public/linker/css/',
				ext: '.css'
			}]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
};
