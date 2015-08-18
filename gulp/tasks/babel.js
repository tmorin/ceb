var gulp = require('gulp');
var babel = require('gulp-babel');

var config = require('../config');

gulp.task('babel:lib', ['lint'], function () {
    return gulp.src(config.paths.lib)
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('babel:umd', ['lint'], function () {
    return gulp.src(config.paths.lib)
        .pipe(babel({
            modules: 'umd'
        }))
        .pipe(gulp.dest('public/umd'));
});

gulp.task('babel:system', ['lint'], function () {
    return gulp.src(config.paths.lib)
        .pipe(babel({
            modules: 'system'
        }))
        .pipe(gulp.dest('public/system'));
});

gulp.task('babel:amd', ['lint'], function () {
    return gulp.src(config.paths.lib)
        .pipe(babel({
            modules: 'amd'
        }))
        .pipe(gulp.dest('public/amd'));
});

gulp.task('babel:example', ['lint'], function () {
    return gulp.src(config.paths.example)
        .pipe(babel({
            modules: 'umd'
        }))
        .pipe(gulp.dest('example'));
});

gulp.task('babel', ['babel:lib', 'babel:umd', 'babel:amd', 'babel:system', 'babel:example']);
