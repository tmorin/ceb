var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', ['watch'], function () {
    browserSync.init({
        server: {
            baseDir: ['./', './example']
        }
    });
    gulp.watch('./dist/**/*').on('change', browserSync.reload);
    gulp.watch('./example/**/*.{html}').on('change', browserSync.reload);
});
