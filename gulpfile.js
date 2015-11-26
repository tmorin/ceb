var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('zip', function () {
    return gulp.src([
            '**/*',
            '!{.idea,.publish,.git,site,dist,lib,node_modules}/**/*',
            '!{.idea,.publish,.git,site,dist,lib,node_modules}',
            '!{.project,*.zip,*.tgz}'
        ], {
            dot: true
        })
        .pipe(zip('ceb-source-' + (Date.now()) + '.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('deploy', function () {
    return gulp.src('./site/**/*').pipe(ghPages());
});
