var gulp = require('gulp');
var babel = require('gulp-babel');
var gulpif = require('gulp-if');

var minify = require('../minify');
var config = require('../config');

function build(src, plugins, dest, min) {
    return gulp.src(src)
        .pipe(babel({
            presets: ['es2015'],
            plugins: plugins
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
            return build(item.src, item.plugins, item.dest, true);
        });
    }

    var plainTaskName = baseTaskName;
    taskNames.push(plainTaskName);
    gulp.task(plainTaskName, ['lint'], function () {
        return build(item.src, item.plugins, item.dest, false);
    });

    return taskNames;
}).reduce(function (a, b) {
    return a.concat(b);
}, []);

gulp.task('babel', taskNames);
