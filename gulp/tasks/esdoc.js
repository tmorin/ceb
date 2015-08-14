var gulp = require('gulp');
var esdoc = require('esdoc');
var publisher = require('esdoc/out/src/Publisher/publish');

gulp.task('esdoc', ['lint'], function() {
    esdoc.generate({
        source: 'src/lib',
        destination: 'api'
    }, publisher);
});
