var gulp = require('gulp');
var babel = require('gulp-babel');

var config = require('../config');

gulp.task('babel:lib', ['lint'], function() {
    return gulp.src(config.paths.lib)
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('babel:test', ['lint'], function() {
    return gulp.src(config.paths.test)
        .pipe(babel())
        .pipe(gulp.dest('test'));
});

gulp.task('babel', ['babel:lib', 'babel:test']);
