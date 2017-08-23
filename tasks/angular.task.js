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

var Elixir = require('laravel-elixir');
var Task = Elixir.Task;

Elixir.extend('angular', function(src, jsOutputFile, jsOutputFolder) {

	var baseDir = src || Elixir.config.assetsPath + '/angular/';
	var jsFile = jsOutputFile || 'app.js';

	var onError = function (err) {
		notify.onError({
			title: "Laravel Elixir",
			subtitle: "Angular Files Compilation Failed!",
			message: "Error: <%= error.message %>",
			icon: __dirname + '/../node_modules/laravel-elixir/icons/fail.png'
		})(err);
		this.emit('end');
	};

	new Task('angular-webpack', function() {
		return gulp.src([baseDir + "index.main.js", baseDir + "**/*.*.js"])
			.on('error', onError)

			 .pipe(eslint())
	         .pipe(eslint.format())
			 .pipe(webpack(webpackConfig))

			//
			.pipe(gulp.dest(Elixir.config.js.tempFolder))

			.pipe(notify({
				title: 'Laravel Elixir',
				subtitle: 'Angular Files Webpacked!',
				icon: __dirname + '/../node_modules/laravel-elixir/icons/laravel.png',
				message: ' '
			}));
	}).watch(baseDir + '/**/*.js');

	//
	// split into two tasks seems necessary due to a bug with pipe/sourcemaps.init and webpack
	// not having any sourcemaps yet. there is also a problem telling gulp that this task below is
	// depending on the webpack task above.
	//
	new Task('angular-js', function(){
		return gulp.src([Elixir.config.js.tempFolder + "/" + jsFile])
			.on('error', onError)

			.pipe(gulpif(!config.production, sourcemaps.init({loadMaps: true})))
			.pipe(ngAnnotate())
			.pipe(gulpif(config.production, uglify()))
			.pipe(gulpif(!config.production, sourcemaps.write(jsOutputFolder)))

			//
			.pipe(gulp.dest(jsOutputFolder || Elixir.config.js.outputFolder))

			.pipe(notify({
				title: 'Laravel Elixir',
				subtitle: 'Angular Files Source-Files!',
				icon: __dirname + '/../node_modules/laravel-elixir/icons/laravel.png',
				message: ' '
			}));
	}).watch(baseDir + '/**/*.js');
});