/*Elixir Task for bower
* Upgraded from https://github.com/ansata-biz/laravel-elixir-bower
*/
var gulp = require( 'gulp' );
var mainBowerFiles = require( 'main-bower-files' );
var filter = require( 'gulp-filter' );
var notify = require( 'gulp-notify' );
var cssnano = require( 'gulp-cssnano' );
var uglify = require( 'gulp-uglify' );
var less = require( 'gulp-less' );
var concat_sm = require( 'gulp-concat-sourcemap' );
var concat = require( 'gulp-concat' );
var gulpIf = require( 'gulp-if' );

var ngConstant = require( 'gulp-ng-constant' );

var Elixir = require( 'laravel-elixir' );
var Task = Elixir.Task;

Elixir.extend( 'bower', function( jsOutputFile, jsOutputFolder, cssOutputFile, cssOutputFolder )
{

	var cssMain = 'vendor.main.css';
	var cssCMS = 'vendor.cms.css';
	var jsMain = 'vendor.main.js';
	var jsCMS = 'vendor.cms.js';

	var jsOutDir = jsOutputFolder || Elixir.config.js.outputFolder;
	var cssOutDir = cssOutputFolder || Elixir.config.css.outputFolder;

	var penv = "production";

	if( !Elixir.config.production )
	{
		concat = concat_sm;
		penv = "development";
	}

	//
	new Task( 'config', function()
	{
		var myConfig = require( '../app.config.json' );
		var envConfig = myConfig[penv];

		return ngConstant( {
			name: "app",
			deps: false,
			constants: envConfig,
			stream: true
		} )
			.pipe( gulp.dest( 'angular' ) );

	} );

	// ---------------------------------------- //
	// ---------------------------------------- //

	//
	var allCMS = mainBowerFiles( { group: 'cms' } );

	var srcMain = mainBowerFiles( { group: 'main' } );
	var srcCMS = [];

	for( var i = 0; i < allCMS.length; i++ ) 
	{
		var file = allCMS[i];

		if( !srcMain.includes(file) )
			srcCMS.push( file );
	}

	// ---------------------------------------- //
	// Main - Dependencies

	//
	new Task( 'bower-js-main', function()
	{
		return gulp.src( srcMain ) // { group 'main' }
			.pipe( filter( '**/*.js' ) )
			.pipe( concat( jsMain, { sourcesContent: Elixir.config.production } ) )
			.pipe( gulpIf( Elixir.config.production, uglify() ) )
			.pipe( gulp.dest( jsOutDir ) );
	} ).watch( 'bower.json' );

	//
	new Task( 'bower-css-main', function()
	{
		return gulp.src( srcMain )
			.pipe( filter( '**/*.css' ) )
			.pipe( concat( cssMain ) )
			.pipe( gulpIf( config.production, cssnano( { safe: true } ) ) )
			.pipe( gulp.dest( cssOutDir ) );
	} ).watch( 'bower.json' );

	// ---------------------------------------- //
	// CMS - Dependencies

	//
	new Task( 'bower-js-cms', function()
	{
		return gulp.src( srcCMS )
			.pipe( filter( '**/*.js' ) )
			.pipe( concat( jsCMS, { sourcesContent: Elixir.config.production } ) )
			.pipe( gulpIf( Elixir.config.production, uglify() ) )
			.pipe( gulp.dest( jsOutDir ) );
	} ).watch( 'bower.json' );

	//
	new Task( 'bower-css-cms', function()
	{
		return gulp.src( srcCMS )
			.pipe( filter( '**/*.css' ) )
			.pipe( concat( cssCMS ) )
			.pipe( gulpIf( config.production, cssnano( { safe: true } ) ) )
			.pipe( gulp.dest( cssOutDir ) );
	} ).watch( 'bower.json' );

	// ---------------------------------------- //
	// ---------------------------------------- //

	//
	new Task( 'copy-assets', function()
	{
		return gulp.src( [
			"resources/images/**/*"
		], {
			base: 'resources/'
		} )
			.pipe( gulp.dest( "public/uploads/" ) );
	} ).watch( 'resources/images/**/*' );
} );

gulp.task( 'gulp-assets', function()
{
	return gulp.src( mainBowerFiles( ['**/*.png', '**/*.ttf', '**/*.woff'] ) )
		.pipe( gulp.dest( './public/build' ) )
} );