var gulp = require('gulp');
var Server = require('karma').Server;

gulp.task('karma:watch', ['lint'], function (done) {
    new Server({
        configFile: __dirname + '/../../karma.conf.js',
        autoWatch: true,
        singleRun: false,
        browserify: {
            transform: ['babelify'],
            watchify: {
                poll: true
            }
        }
    }, done).start();
});

gulp.task('karma', ['lint'], function (done) {
    var server = new Server({
        configFile: __dirname + '/../../karma.conf.js',
        singleRun: true
    }, function (code, err) {
        if (err) {
            done(err);
        }
        done();
    });
    server.start();
});
