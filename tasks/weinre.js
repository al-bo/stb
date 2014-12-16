/**
 * WEb INspector REmote debugger server.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path   = require('path'),
	gulp   = require('gulp'),
	gutil  = require('gulp-util'),
	config = require(path.join(__dirname, '..', 'lib', 'config'))('weinre'),
	title  = 'weinre  '.inverse;


gulp.task('weinre', function () {
	var spawn, weinre;

	if ( config.active ) {
		spawn  = require('child_process').spawn;
		weinre = spawn(path.join(process.env.STB, 'node_modules', '.bin', 'weinre'), [
			'--httpPort',  config.port,
			'--boundHost', config.host,
			'--verbose',   config.logging.toString(),
			'--debug',     config.logging.toString()
		]);

		weinre.on('exit', function () {
			gutil.log(title, 'process terminated'.red);
		});

		weinre.on('error', function () {
			gutil.log(title, 'FATAL ERROR'.red, '(check weinre is installed)');
		});

		weinre.stderr.on('data', function ( data ) {
			gutil.log(title, data.toString().trim().red);
		});

		weinre.stdout.on('data', function ( data ) {
			data.toString().trim().split('\n').forEach(function ( line ) {
				gutil.log(title, line.trim().split(' weinre: ').pop());
			});
		});
	}
});
