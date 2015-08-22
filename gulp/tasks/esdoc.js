var gulp = require('gulp');
var esdoc = require('esdoc');
var publisher = require('esdoc/out/src/Publisher/publish');

gulp.task('esdoc', ['lint'], function() {
    esdoc.generate({
        source: 'es6/lib',
        destination: 'api'
    }, publisher);
});
