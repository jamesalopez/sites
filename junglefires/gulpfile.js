"use strict";

var gulp = require('gulp'),
    notify = require('gulp-notify'),
    clean = require('gulp-clean'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    connect = require('gulp-connect'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps');

//Unit and e2e plugins
var karma = require('karma').server;
var webdriver_standalone = require("gulp-protractor").webdriver_standalone;
var protractor = require("gulp-protractor").protractor;

//Main paths in the app
var configPaths = {
    bower: './vendor/',
    dist: './dist/',
    app: './app/',
    specs: './specs'
};

/**
 * JS literal object to mange all the JS
 *
 * @array libraries: All JS Libraries and dependencies,
 * @array sourceMaps: All the JS sources maps,
 * @array app: angular application
 */
var scripts = {
    libraries: [
        configPaths.bower + 'jquery/dist/jquery.min.js',
        configPaths.bower + 'angular/angular.min.js',
        configPaths.bower + 'angular-mocks/angular-mocks.js'
    ],
    sourceMaps: [
        configPaths.bower + 'jquery/dist/jquery.min.map',
        configPaths.bower + 'angular/angular.min.js.map'
    ],
    app: [
        configPaths.app + 'scripts/**/*.js'
    ]
};

/**
 * JS literal object to mange all the CSS
 *
 * @array libraries: All the CSS Libraries and dependencies,
 * @array app: All the CSS sources maps
 *
 */
var styles = {
    libraries: [
        configPaths.bower + 'bootstrap/dist/css/bootstrap.min.css'
    ],
    app: [
        configPaths.app + 'sass/**/*.scss'
    ]
};

var fonts = [configPaths.bower + 'bootstrap/fonts/*.*'];

/**
 * Gulp tasks
 */

//JS
gulp.task('clean-scripts', function () {
    return gulp.src(configPaths.dist + 'js', {read: false})
        .pipe(clean());
});

gulp.task('vendor-scripts-map', ['clean-scripts'], function () {
    return gulp.src(scripts.sourceMaps)
        .pipe(gulp.dest(configPaths.dist + 'js'));
});

gulp.task('vendor-scripts', ['vendor-scripts-map'], function () {
    return gulp.src(scripts.libraries)
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(rename('vendor.min.js'))
        .pipe(gulp.dest(configPaths.dist + 'js'));
});

gulp.task('scripts', ['vendor-scripts'], function () {
    return gulp.src(scripts.app)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify({mangle: true}))
        .pipe(rename('app.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(configPaths.dist + 'js'))
});

//Generate CSS files
gulp.task('clean-styles', function () {
    return gulp.src(configPaths.dist + 'css', {read: false})
        .pipe(clean());
});

gulp.task('vendor-styles', ['clean-styles'], function () {
    return gulp.src(styles.libraries)
        .pipe(concatCss('vendor.css'))
        .pipe(minifyCss())
        .pipe(rename('vendor.min.css'))
        .pipe(gulp.dest(configPaths.dist + 'css'));
});
gulp.task('styles', ['vendor-styles'], function () {
    return gulp.src(styles.app)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(rename('app.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(configPaths.dist + 'css'));
});

//Templates

gulp.task('clean-templates', function () {
    return gulp.src(configPaths.dist + '*.html')
        .pipe(clean());
});

gulp.task('templates', ['clean-templates'], function () {
    return gulp.src('app/templates/**/*.jade')
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(configPaths.dist))
});

// Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe(gulp.dest(configPaths.dist + 'images'));
});


//Fonts
gulp.task('clean-fonts', function () {
    return gulp.src(configPaths.dist + 'fonts', {read: false})
        .pipe(clean());
});

gulp.task('fonts', ['clean-fonts'], function () {
    return gulp.src(fonts)
        .pipe(gulp.dest(configPaths.dist + 'fonts'));
});

gulp.task('connect', function () {
    connect.server({
        root: ['dist'],
        port: 3001,
        livereload: true
    });
});


//Server
gulp.task('serve', ['scripts','templates','styles','images'], function () {
    return gulp.start('watch');
});


// Watch
gulp.task('watch', ['connect'], function () {

    gulp.watch(configPaths.app + '**/*.*', function (event) {
        return gulp.src(event.path)
            .pipe(connect.reload());
    });

    // Watch .scss files
    gulp.watch(configPaths.app + 'sass/**/*.scss', ['styles']);

    // Watch .scripts files
    gulp.watch(configPaths.app + 'scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch(configPaths.app + 'images/**/*', ['images']);

    // Watch .jade files
    gulp.watch(configPaths.app + 'templates/**/*.jade', ['templates']);

    // Watch vendor folder
    gulp.watch(configPaths.bower, ['styles', 'scripts']);
});

//Build all
gulp.task('build', ['templates', 'styles', 'scripts', 'fonts']);

/**
 * Unit and e2e Test task
 */

gulp.task('unit-test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

//Turn on the selenium server
gulp.task('webdriver_standalone', webdriver_standalone);

gulp.task('e2e-test', ['serve'], function () {
    gulp.src(configPaths.specs + 'e2e/**/*.spec.js')
        .pipe(protractor({
            configFile: __dirname + "/protractor.conf.js"
        }))
        .on('error', function (e) {
            throw e
        });
});
