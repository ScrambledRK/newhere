/*Elixir Task for bower
* Upgraded from https://github.com/ansata-biz/laravel-elixir-bower
*/
var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var notify = require('gulp-notify');
var cssnano = require('gulp-cssnano');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var concat_sm = require('gulp-concat-sourcemap');
var concat = require('gulp-concat');
var gulpIf = require('gulp-if');

var Elixir = require('laravel-elixir');
var Task = Elixir.Task;

/**
 * 
 */
Elixir.extend('tinymce', function( cssOutputFile, cssOutputFolder) {

	var cssFile = 'tinymcs_custom.css';
	var lessFile = 'tinymcs_custom_less.css';

	if (!Elixir.config.production){
		concat = concat_sm;
	}

	//
	//
	new Task('tinymcs-custom-less', function(){
		return gulp.src([
			"angular/material/colors.less",
			"angular/material/custom.less"
		])
			.pipe(filter('**/*.less'))
			.pipe(less())
			.pipe(concat(lessFile))
			.pipe(gulpIf(config.production, cssnano({safe: true})))
			.pipe(gulp.dest(Elixir.config.css.tempFolder));
	}).watch('angular/material/**/*.less');	

	//
	//
	new Task('tinymcs-custom-css', function(){
		return gulp.src([
			"bower_components/bootstrap-css-only/css/bootstrap.css",
			Elixir.config.css.tempFolder + "/" + lessFile
		])
			.pipe(filter('**/*.css'))
			.pipe(concat(cssFile))
			.pipe(gulpIf(config.production, cssnano({safe: true})))
			.pipe(gulp.dest(cssOutputFolder || config.css.outputFolder));
	}).watch('bower.json');	

	//
	// https://github.com/ck86/main-bower-files/issues/153
	// files otherwise not included (tinymce is missing as dependency of ui-tinymce)
	//
	new Task('bower-tinymce', function(){
		return gulp.src([
			"bower_components/tinymce/skins/lightgray/skin.min.css",
			"bower_components/tinymce/skins/lightgray/content.min.css",
			"bower_components/tinymce/skins/lightgray/fonts/tinymce.ttf",
			"bower_components/tinymce/skins/lightgray/fonts/tinymce.woff",
			"bower_components/tinymce/plugins/autolink/plugin.js",
			"bower_components/tinymce/plugins/code/plugin.js",
			"bower_components/tinymce/plugins/image/plugin.js",
			"bower_components/tinymce/plugins/link/plugin.js"
		], {
			base: 'bower_components/tinymce/'
		})
			.pipe(gulp.dest("public/build/js") );
	}).watch('bower.json');

	//
	new Task('bower-tinymce', function(){
		return gulp.src([
			"bower_components/tinymce/skins/lightgray/fonts/tinymce.ttf",
			"bower_components/tinymce/skins/lightgray/fonts/tinymce.woff"
		], {
			base: 'bower_components/tinymce/skins/lightgray/'
		})
			.pipe(gulp.dest("public/build/css") );
	}).watch('bower.json');

});