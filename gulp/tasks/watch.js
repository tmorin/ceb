var gulp = require('gulp');
var watchify = require('watchify');
var gutil = require('gulp-util');

var config = require('../config');
var b = require('./browserify');

function bundle(bundler, item) {
    return b.streamify(bundler, item.distName, item.distPath);
}

var taskNames = config.browserify.map(function (item) {
    var taskNames = [];

    var baseTaskName = 'watchify:' + item.distPath + '/' + item.distName;
    var bundler = watchify(b.bundlelify(item.entry, item.standalone, item.modules, watchify.args));

    bundler.on('update', function () {
        return bundle(bundler, item);
    });
    bundler.on('log', gutil.log);

    var plainTaskName = baseTaskName;
    taskNames.push(plainTaskName);
    gulp.task(plainTaskName, ['lint'], function () {
        return bundle(bundler, item);
    });

    return taskNames;
}).reduce(function (a, b) {
    return a.concat(b);
}, []);

gulp.task('watchify', taskNames);

gulp.task('watch', ['watchify'], function () {
    gulp.watch(config.paths.example, ['babel']);
});
