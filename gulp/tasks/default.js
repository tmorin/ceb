var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');

var config = require('../config');

gulp.task('clean', [], function (cb) {
    del(config.paths.clean).then(function () {
        cb();
    }, cb);
});

gulp.task('build', [
    'babel',
    'browserify'
]);

gulp.task('default', ['clean'], function (done) {
    return runSequence(['build', 'karma', 'esdoc'], done);
});
