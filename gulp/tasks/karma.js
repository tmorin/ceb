var gulp = require('gulp');
var runSequence = require('run-sequence');
var Server = require('karma').Server;

var config = require('../config');

gulp.task('karma:watch', ['lint'], function (done) {
    new Server({
        configFile: __dirname + '/../../karma.conf.js',
        autoWatch: true,
        singleRun: false,
        browserify: {
            watchify: {
                poll: true
            },
            transform: [
                ['babelify', {
                    presets: ['es2015'],
                    plugins: ['transform-es2015-modules-commonjs']
                }]
            ]
        }
    }, done).start();
});

gulp.task('karma', ['lint'], function (done) {
    var server = new Server({
        configFile: __dirname + '/../../karma.conf.js'
    }, function (code, err) {
        if (err) {
            done(err);
        }
        done();
    });
    server.start();
});

function createSauceTask(name) {
    gulp.task('karma:sauce:' + name, ['lint'], function (done) {
        new Server({
            configFile: __dirname + '/../../karma.conf.js',
            sauceLabs: {
                testName: 'Custom Elements Builder Test',
                recordVideo: false,
                recordScreenshots: false
            },
            captureTimeout: 3 * 60 * 1000,
            reporters: ['dots', 'saucelabs'],
            singleRun: true,
            autoWatch: false,
            customLaunchers: config.customLaunchers,
            browsers: config.sauceTasks[name]
        }, function (code, err) {
            if (err) {
                done(err);
            }
            done();
        }).start();
    });
}

Object.keys(config.sauceTasks).forEach(createSauceTask);

gulp.task('karma:sauce', ['lint'], function (done) {
    var taskNames = Object.keys(config.sauceTasks).map(function (name) {
        return 'karma:sauce:' + name;
    });
    taskNames.push(done);
    runSequence.apply(null, taskNames);
});
