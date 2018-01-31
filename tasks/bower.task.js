/*Elixir Task for bower
* Upgraded from https://github.com/ansata-biz/laravel-elixir-bower
*/
var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var notify = require('gulp-notify');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
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

	var onError = function (err) {
		notify.onError({
			title: "Laravel Elixir",
			subtitle: "Bower Files Compilation Failed!",
			message: "Error: <%= error.message %>",
			icon: __dirname + '/../node_modules/laravel-elixir/icons/fail.png'
		})(err);
		this.emit('end');
	};

	//
	new Task('bower-js', function() {
		return gulp.src(mainBowerFiles())
			.on('error', onError)
			.pipe(filter('**/*.js'))
			.pipe(concat(jsFile, {sourcesContent: true}))
			.pipe(gulpIf(Elixir.config.production, uglify()))
			.pipe(gulp.dest(jsOutputFolder || Elixir.config.js.outputFolder))
			.pipe(notify({
				title: 'Laravel Elixir',
				subtitle: 'Javascript Bower Files Imported!',
				icon: __dirname + '/../node_modules/laravel-elixir/icons/laravel.png',
				message: ' '
			}));
	}).watch('bower.json');

	//
	new Task('bower-css', function(){
		return gulp.src(mainBowerFiles())
			.on('error', onError)
			.pipe(filter('**/*.css'))
			.pipe(concat(cssFile))
			.pipe(gulpIf(config.production, cssnano({safe: true})))
			.pipe(gulp.dest(cssOutputFolder || config.css.outputFolder))
			.pipe(notify({
				title: 'Laravel Elixir',
				subtitle: 'CSS Bower Files Imported!',
				icon: __dirname + '/../node_modules/laravel-elixir/icons/laravel.png',
				message: ' '
			}));
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
			.on('error', onError)
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
			.on('error', onError)
			.pipe(gulp.dest("public/build/css") );
	}).watch('bower.json');

	//
	// new Task('translations', function(){
	// 	return gulp.src([
	// 		"resources/translations/json/*.json"
	// 	], {
	// 		base: 'resources/translations/json/'
	// 	})
	// 		.on('error', onError)
	// 		.pipe(gulp.dest("public/translations") );
	// }).watch("resources/translations/json/*.json");
});

gulp.task('gulp-assets', function() {
    return gulp.src(mainBowerFiles(['**/*.png','**/*.ttf','**/*.woff']))
        .pipe( gulp.dest('./public/build') )
});