var gulp = require('gulp');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var Server = require('karma').Server;

var config = {
    sauceTasks: {
        ie: ['slIe11', 'slIe10', 'slIe9'],
        evergreen: ['slChrome', 'slFirefox'],
        safari: ['slSafari7', 'slSafari8'],
        android: ['slAndroid4', 'slAndroid5']/*,
         iphone: ['slIPhone7', 'slIPhone8'],
         ipad: ['slIPad7', 'slIPad8']*/
    },
    customLaunchers: {
        slChrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            version: ''
        },
        slFirefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            version: ''
        },
        slIe11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11'
        },
        slIe10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '10'
        },
        slIe9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '9'
        },
        slAndroid4: {
            base: 'SauceLabs',
            browserName: 'android',
            version: '4.4'
        },
        slAndroid5: {
            base: 'SauceLabs',
            browserName: 'android',
            version: '5.0'
        },
        slSafari7: {
            base: 'SauceLabs',
            browserName: 'safari',
            version: '7'
        },
        slSafari8: {
            base: 'SauceLabs',
            browserName: 'safari',
            version: '8'
        },
        slIPhone7: {
            base: 'SauceLabs',
            browserName: 'iphone',
            deviceName: 'iPhone Simulator',
            version: '7.1',
            platform: 'OS X 10.10',
            'device-orientation': 'portrait'
        },
        slIPhone8: {
            base: 'SauceLabs',
            browserName: 'iphone',
            deviceName: 'iPhone Simulator',
            version: '8.4',
            platform: 'OS X 10.10',
            'device-orientation': 'portrait'
        },
        slIPad7: {
            base: 'SauceLabs',
            browserName: 'iphone',
            deviceName: 'iPad Simulator',
            version: '7.1',
            platform: 'OS X 10.10',
            'device-orientation': 'portrait'
        },
        slIPad8: {
            base: 'SauceLabs',
            browserName: 'iphone',
            deviceName: 'iPad Simulator',
            version: '8.4',
            platform: 'OS X 10.10',
            'device-orientation': 'portrait'
        }
    }
};

gulp.task('zip:source', function () {
    return gulp.src([
            '**/*',
            '!{.idea,.git,api,dist,lib,node_modules,junit}/**/*',
            '!{.idea,.git,api,dist,lib,node_modules,junit}',
            '!{.project,*.zip}'
        ], {
            dot: true
        })
        .pipe(zip('ceb-source-' + (Date.now()) + '.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('zip', ['zip:source']);

function createSauceTask(name) {
    gulp.task('karma:sauce:' + name, function (done) {
        new Server({
            configFile: __dirname + '/karma.conf.js',
            sauceLabs: {
                testName: 'ceb - ' + name,
                recordVideo: false,
                recordScreenshots: false
            },
            captureTimeout: 3 * 60 * 1000,
            reporters: ['dots', 'saucelabs', 'junit'],
            junitReporter: {
                outputDir: process.env.CIRCLE_TEST_REPORTS || 'junit',
                useBrowserName: true
            },
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

gulp.task('karma:sauce', [], function (done) {
    var taskNames = Object.keys(config.sauceTasks).map(function (name) {
        return 'karma:sauce:' + name;
    });
    taskNames.push(done);
    runSequence.apply(null, taskNames);
});
