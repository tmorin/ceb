var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');

var browserify = require('browserify');
var babelify = require('babelify');

var source = require('vinyl-source-stream');

var config = require('../config');
var minify = require('../minify');
var assign = require('lodash/object/assign');

function bundlelify(entry, standalone, modules, args) {
    var options = {
        entries: [entry],
        standalone: standalone
    };
    if (args) {
        assign({}, args, options);
    }
    var bundler = browserify(options);
    bundler.transform(babelify.configure({
        modules: modules
    }));
    return bundler;
}
exports.bundlelify = bundlelify;

function streamify(bundler, distName, distPath, min) {
    return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(distName))
        .pipe(gulpif(min, minify()))
        .pipe(gulp.dest(distPath));
}
exports.streamify = streamify;

function build(entry, standalone, modules, distName, distPath, min) {
    var bundler = bundlelify(entry, standalone, modules);
    return streamify(bundler, distName, distPath, min);
}
exports.build = build;

var taskNames = config.browserify.map(function (item) {
    var taskNames = [];

    var baseTaskName = 'browserify:' + item.distPath + '/' + item.distName;

    if (item.min) {
        var minTaskName = baseTaskName + ':min';
        taskNames.push(minTaskName);
        gulp.task(minTaskName, ['lint'], function () {
            return build(item.entry, item.standalone, item.modules, item.distName, item.distPath, item.min);
        });
    }

    var plainTaskName = baseTaskName;
    taskNames.push(plainTaskName);
    gulp.task(plainTaskName, ['lint'], function () {
        return build(item.entry, item.standalone, item.modules, item.distName, item.distPath);
    });

    return taskNames;
}).reduce(function (a, b) {
    return a.concat(b);
}, []);

gulp.task('browserify', taskNames);
