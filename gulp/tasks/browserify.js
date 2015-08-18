var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var browserify = require('browserify');

var lazypipe = require('lazypipe');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var config = require('../config');

var minify = lazypipe().pipe(buffer).pipe(function () {
    return sourcemaps.init({
        loadMaps: true
    });
}).pipe(uglify).pipe(function () {
    return sourcemaps.write('./');
});

function browserifies(bundler, src, dest, min) {
    return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(src))
        .pipe(gulpif(min, minify()))
        .pipe(gulp.dest(dest));
}
exports.browserifies = browserifies;

function setup(conf, min) {
    var distName = (min ? conf.distName + '.min' : conf.distName) + '.js';
    return browserifies(browserify(conf.entry, {
        standalone: 'ceb'
    }), distName, conf.distPath, min);
}

var minTaskNames = [];
var plainTaskNames = [];

config.browserify.forEach(function (conf) {
    if (conf.min) {
        var minTaskName = conf.distPath + '/' + conf.distName + ':min';
        minTaskNames.push(minTaskName);
        gulp.task(minTaskName, ['babel:lib'], function () {
            return setup(conf, true);
        });
    }

    var plainTaskName = conf.distPath + '/' +conf.distName + ':plain';
    gulp.task(plainTaskName, ['babel:lib'], function () {
        return setup(conf, false);
    });
    plainTaskNames.push(plainTaskName);
});

gulp.task('browserify:min', minTaskNames);
gulp.task('browserify:plain', plainTaskNames);

gulp.task('browserify', ['browserify:min', 'browserify:plain']);
