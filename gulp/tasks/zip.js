var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('zip:source', function () {
    return gulp.src([
        '**/*',
        '!{lib,test,public,node_modules,.git,.tmp}/**/*',
        '!{lib,test,public,node_modules,.git,.tmp}',
        '!{.project,ceb-source.zip}'
    ], {
        dot: true
    })
    .pipe(zip('ceb-source.zip'))
    .pipe(gulp.dest('.'));
});

gulp.task('zip', ['zip:source']);
