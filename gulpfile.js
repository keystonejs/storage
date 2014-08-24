var gulp = require('gulp'),
	cover = require('gulp-coverage'),
	jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha'),
	rimraf = require('gulp-rimraf'),
	jsdoc = require("gulp-jsdoc");


// Common project paths
var paths = {
	'src': ['./lib/**/*.js'],
	'tests': ['./test/**/*.js']
};

// An error handler for the tests during gulp-watch
// Otherwise the gulp-watch will terminate
var handleError = function (err) {
	console.log(chalk.red(err.name + ': ' + err.plugin + ' - ' + err.message));
	return;
};

/**
 * Gulp Tasks
 */

// lint source with jshint
gulp.task('lint', function () {
	return gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));

});

// run the mocha tests with the default dot reporter
gulp.task('test', function () {
	return gulp.src(paths.tests)
		.pipe(mocha({
			reporter: 'dot'
		}))
		.on('error', handleError);

});

// generate a coverage report
gulp.task('coverage', function () {
	return gulp.src(paths.tests)
		.pipe(cover.instrument({
			pattern: paths.src,
			debugDirectory: '.coverdebug'
		}))
		.pipe(mocha({
			reporter: 'spec'
		}))
		.pipe(cover.report({
			outFile: 'coverage.html'
		}))
		.on('error', handleError);
});

// delete the coverage report
gulp.task('clean-coverage', function () {
	return gulp.src(['.coverdebug', '.coverdata', '.coverrun', 'coverage.html'], { read: false })
		.pipe(rimraf())
});

gulp.task('doc', function () {
	return gulp.src("./lib/**/*.js")
		.pipe(jsdoc.parser({
			plugins: ['plugins/markdown']
		}))
		.pipe(jsdoc('./documentation-output'))
});

/*
 * auto/watch gulp tasks that will trigger the tests on
 * file changes
 */

gulp.task('autotest', function () {
	gulp.watch(paths.src.concat(paths.tests), ['test']);
});