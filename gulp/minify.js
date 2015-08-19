var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var lazypipe = require('lazypipe');
var buffer = require('vinyl-buffer');

var rename = require('gulp-rename');

module.exports = lazypipe()
    .pipe(buffer)
    .pipe(function () {
        return rename(function (path) {
            path.extname = '.min' + path.extname;
        });
    }).pipe(function () {
        return sourcemaps.init({
            loadMaps: true
        });
    })
    .pipe(uglify)
    .pipe(function () {
        return sourcemaps.write('./');
    });
