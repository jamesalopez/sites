'use strict';

/*
* ---------------------------------------------------
*
* Global Variables
*
* ---------------------------------------------------
*/

	var app = {
		root: 'app',
		tmp: '.tmp',
		dist: 'dist',
		port: 3000
	};


/*
* ---------------------------------------------------
*
* Gulp Dependencies
*
* ---------------------------------------------------
*/

	var gulp = require('gulp'),
		del = require('del'),
		$ = require('gulp-load-plugins')();


/* * * * * * * * * * * * * * * * * * * * * * * * * *
 * Server
 * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

	gulp.task('server', function() {
		$.connect.server({
			host: '127.0.0.1',
			root: [app.root, app.tmp],
			port: app.port,
			livereload: true
		});
	});


/* * * * * * * * * * * * * * * * * * * * * * * * * *
 * Clean
 * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

	gulp.task('clean:tmp', function (cb) {
		return del([ app.tmp, app.dist, app.root +'/templates/.compiled' ], cb);
	});



/* * * * * * * * * * * * * * * * * * * * * * * * * *
 * Bundle Assers using useref comment blocks
 * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

	gulp.task('bundle', function () {
		var assets = $.useref.assets({ searchPath: [app.root, app.o_tmp] });
		return gulp.src( app.tmp + '/**/*.html')
			.pipe(assets)
			.pipe(assets.restore())
			.pipe($.useref())
			.pipe(gulp.dest(app.tmp));
	});

/* * * * * * * * * * * * * * * * * * * * * * * * * *
 * Images
 * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

	gulp.task('images', function() {
		return gulp.src( app.root + '/images/**/*.{png,jpg,gif,svg}')
				.pipe(gulp.dest(app.dist + '/images/'));
	});


/* * * * * * * * * * * * * * * * * * * * * * * * * *
 * SASS
 * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

	gulp.task('sass', function () {
		return gulp.src( app.root + '/styles/**/*.{scss,sass}')
			.pipe($.sass().on('error', $.sass.logError))
			.pipe($.sass({outputStyle: 'compressed'}))
			.pipe(gulp.dest( app.o_tmp + '/styles/'));
	});



/* * * * * * * * * * * * * * * * * * * * * * * * * *
 * javascript
 * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

	gulp.task('scripts', function (event) {
		return gulp.src(app.root + '/scripts/app.js')
			.pipe($.browserify({ insertGlobals : true, debug : true}))
			.pipe(gulp.dest(app.tmp + '/javascripts/'));
	});


/* * * * * * * * * * * * * * * * * * * * * * * * * *
 * templates
 * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

	gulp.task('jade', function() {
		return gulp.src(app.root + '/jade/*.jade')
			.pipe($.jade({ pretty: true}))
			.pipe(gulp.dest(app.tmp));
	});


/* * * * * * * * * * * * * * * * * * * * * * * * * *
 * data
 * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

	gulp.task('json', function() {
		return gulp.src(app.root + '/api/**/*.json')
			.pipe(gulp.dest(app.dist + '/api/'));
	});;


/* * * * * * * * * * * * * * * * * * * * * * * * * *
 * fonts
 * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

	gulp.task('fonts', function () {
		return gulp.src(app.root + '/styles/fonts/**/*.{ttf,woff,eot,svg}')
			.pipe(gulp.dest(app.tmp + '/styles/fonts'));
	});

/* * * * * * * * * * * * * * * * * * * * * * * * * *
 * Watch
 * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

	gulp.task('watch', ['server'], function () {

		// Watch handlebar files
		gulp.watch(app.root + '/templates/.compiled/**/*.html', ['handlebars']);

		// Watch jade files
		gulp.watch(app.root + '/jade/**/*.jade', ['jade']);

		// Watch .js files
		gulp.watch(app.root + '/styles/**/*.scss', ['sass']);

		// reload server on changes
		gulp.watch([
			app.tmp + '/*.html',
			app.tmp + '/styles/**/*.css',
			app.root+ '/scripts/**/*.js',
			app.tmp + '/scripts/templates.js',
			app.root+ '/images/**/*'
			], function (event) {
				// reload changed file
				return gulp.src(event.path)
					.pipe($.connect.reload());
			});
	});


/*
* ---------------------------------------------------
*
* Gulp Commands
*
* ---------------------------------------------------
*/

	// Default Task
	gulp.task('default', ['build']);

	// Main build task
	gulp.task('build', ['clean'], function(){
		app.o_tmp = app.tmp;
		app.tmp = app.dist;
		gulp.start('assets');
	});

	// Clean dist & temp folders
	gulp.task('clean', ['clean:tmp']);

	// Package all assets
	gulp.task('assets', ['generated', 'json', 'images','fonts'], function(){
		gulp.start('bundle');
	});

	// Auto generated files
	gulp.task('generated', ['jade','sass']);

	// Serve the build folder
	gulp.task('serve', ['clean'], function(){
		app.o_tmp = app.tmp;
		gulp.start('assets+serve');
	});

	// Create assets and serve
	gulp.task('assets+serve', ['generated'], function(){
		gulp.start('watch');
	});
