/*Elixir Task
 *copyrights to https://github.com/HRcc/laravel-elixir-angular
 */
var gulp = require('gulp');

var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var notify = require('gulp-notify');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack-stream');
var webpackConfig = require('../webpack.config.js')
var mainBowerFiles = require( 'main-bower-files' );

var Elixir = require('laravel-elixir');
var Task = Elixir.Task;

Elixir.extend('angular', function(src, jsOutputFile, jsOutputFolder) {

	var baseDir = src || Elixir.config.assetsPath + '/angular/';
	var jsMain = 'main.bundle.js';
	var jsCMS = 'cms.bundle.js';

	var src = []; //mainBowerFiles();
		src = src.concat( [baseDir + "index.main.js", baseDir + "**/*.*.js"] );

	new Task('angular-webpack', function() {
		return gulp.src( src )
			 .pipe(eslint())
	         .pipe(eslint.format())
			 .pipe(webpack(webpackConfig))
			.pipe(gulp.dest(Elixir.config.js.tempFolder));
	}).watch(baseDir + '/**/*.js');

	//
	// split into two tasks seems necessary due to a bug with pipe/sourcemaps.init and webpack
	// not having any sourcemaps yet. there is also a problem telling gulp that this task below is
	// depending on the webpack task above.
	//
	new Task('angular-js-main', function(){
		return gulp.src([Elixir.config.js.tempFolder + "/" + jsMain])
			.pipe(gulpif(!config.production, sourcemaps.init({loadMaps: true})))
			.pipe(ngAnnotate())
			.pipe(gulpif(config.production, uglify()))
			.pipe(gulpif(!config.production, sourcemaps.write(jsOutputFolder)))
			.pipe(gulp.dest(jsOutputFolder || Elixir.config.js.outputFolder));
	}).watch(baseDir + '/**/*.js');

	new Task('angular-js-cms', function(){
		return gulp.src([Elixir.config.js.tempFolder + "/" + jsCMS])
			.pipe(gulpif(!config.production, sourcemaps.init({loadMaps: true})))
			.pipe(ngAnnotate())
			.pipe(gulpif(config.production, uglify()))
			.pipe(gulpif(!config.production, sourcemaps.write(jsOutputFolder)))
			.pipe(gulp.dest(jsOutputFolder || Elixir.config.js.outputFolder));
	}).watch(baseDir + '/**/*.js');
});