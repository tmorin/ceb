var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', ['watch'], function () {
    browserSync.init({
        server: {
            baseDir: ['./example', './']
        }
    });
    gulp.watch('./dist/**.*').on('change', browserSync.reload);
    gulp.watch('./example/**.*').on('change', browserSync.reload);
    gulp.watch('./public/**.*').on('change', browserSync.reload);
});
