var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('zip:source', function () {
    return gulp.src([
        '**/*',
        '!{.idea,.git,api,lib,node_modules,public}/**/*',
        '!{.idea,.git,api,lib,node_modules,public}',
        '!{.project,ceb-source.zip}'
    ], {
        dot: true
    })
    .pipe(zip('ceb-source.zip'))
    .pipe(gulp.dest('.'));
});

gulp.task('zip', ['zip:source']);
