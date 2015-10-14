var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('zip:source', function () {
    return gulp.src([
        '**/*',
        '!{.idea,.git,api,dist,lib,node_modules}/**/*',
        '!{.idea,.git,api,dist,lib,node_modules}',
        '!{.project,ceb-source.zip}'
    ], {
        dot: true
    })
    .pipe(zip('ceb-source-' + (Date.now()) + '.zip'))
    .pipe(gulp.dest('.'));
});

gulp.task('zip', ['zip:source']);
