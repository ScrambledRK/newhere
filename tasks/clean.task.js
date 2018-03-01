/*Elixir Task for bower
* Upgraded from https://github.com/ansata-biz/laravel-elixir-bower
*/
var gulp = require('gulp');
var del = require('del');

var Elixir = require('laravel-elixir');
var Task = Elixir.Task;

/**
 * 
 */
Elixir.extend('clean', function() {

	//
	new Task('clean-build', function()
	{
		return del( [
			"public/build",
			"public/jstmp",
			"public/js",
			"public/cstmp",
			"public/css"
		] ).then(paths => {
			console.log('Deleted files and folders:\n', paths.join('\n'));
		});
	});

});