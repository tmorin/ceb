var gulp = require('gulp');
var jshint = require('gulp-jshint');
require('jshint-stylish');

var config = require('../config');

gulp.task('lint', function () {
    return gulp.src([
        config.paths.gulp,
        config.paths.lib,
        config.paths.test,
        config.paths.example
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
