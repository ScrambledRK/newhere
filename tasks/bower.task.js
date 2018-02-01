/*Elixir Task for bower
* Upgraded from https://github.com/ansata-biz/laravel-elixir-bower
*/
var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var notify = require('gulp-notify');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var concat_sm = require('gulp-concat-sourcemap');
var concat = require('gulp-concat');
var gulpIf = require('gulp-if');

var Elixir = require('laravel-elixir');

var Task = Elixir.Task;

Elixir.extend('bower', function(jsOutputFile, jsOutputFolder, cssOutputFile, cssOutputFolder) {

	var cssFile = cssOutputFile || 'vendor.css';
	var jsFile = jsOutputFile || 'vendor.js';

	if (!Elixir.config.production){
		concat = concat_sm;
	}

	//
	new Task('bower-js', function() {
		return gulp.src(mainBowerFiles())
			.pipe(filter('**/*.js'))
			.pipe(concat(jsFile, {sourcesContent: true}))
			.pipe(gulpIf(Elixir.config.production, uglify()))
			.pipe(gulp.dest(jsOutputFolder || Elixir.config.js.outputFolder));
	}).watch('bower.json');

	//
	new Task('bower-css', function(){
		return gulp.src(mainBowerFiles())
			.pipe(filter('**/*.css'))
			.pipe(concat(cssFile))
			.pipe(gulpIf(config.production, cssnano({safe: true})))
			.pipe(gulp.dest(cssOutputFolder || config.css.outputFolder));
	}).watch('bower.json');

	//
	new Task('copy-assets', function(){
		return gulp.src([
			"resources/images/**/*"
		], {
			base: 'resources/'
		})
			.pipe(gulp.dest("public/uploads/") );
	}).watch('resources/images/**/*');
});

gulp.task('gulp-assets', function() {
    return gulp.src(mainBowerFiles(['**/*.png','**/*.ttf','**/*.woff']))
        .pipe( gulp.dest('./public/build') )
});