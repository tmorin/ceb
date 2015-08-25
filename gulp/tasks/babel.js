var gulp = require('gulp');
var babel = require('gulp-babel');
var gulpif = require('gulp-if');

var minify = require('../minify');
var config = require('../config');

function build(src, modules, dest, min) {
    return gulp.src(src)
        .pipe(babel({
            modules: modules
        }))
        .pipe(gulpif(min, minify()))
        .pipe(gulp.dest(dest));
}

var taskNames = config.babelify.map(function (item) {
    var taskNames = [];

    var baseTaskName = 'babel:' + item.dest;

    if (item.min) {
        var minTaskName = baseTaskName + ':min';
        taskNames.push(minTaskName);
        gulp.task(minTaskName, ['lint'], function () {
            return build(item.src, item.modules, item.dest, true);
        });
    }

    var plainTaskName = baseTaskName;
    taskNames.push(plainTaskName);
    gulp.task(plainTaskName, ['lint'], function () {
        return build(item.src, item.modules, item.dest, false);
    });

    return taskNames;
}).reduce(function (a, b) {
    return a.concat(b);
}, []);

gulp.task('babel', taskNames);
