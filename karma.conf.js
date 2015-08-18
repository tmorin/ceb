'use strict';

module.exports = function (config) {

    config.set({

        basePath: '',

        frameworks: ['mocha', 'sinon-chai', 'browserify'],

        files: [
            'node_modules/document-register-element/build/document-register-element.js',
            //'node_modules/webcomponents.js/webcomponents-lite.min.js',
            'es6/test/**/*.spec.js'
        ],

        exclude: [],

        preprocessors: {
            'es6/**/*.js': ['browserify']
        },

        browserify: {
            transform: ['babelify']
        },

        reporters: ['progress'],

        coverageReporter: {
            dir: './.tmp/cov',
            reporters: [{
                type: 'lcov',
                subdir: 'lcov'
            }, {
                type: 'html',
                subdir: 'html'
            }]
        },

        port: 9877,

        colors: true,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO ||
        logLevel: config.LOG_INFO,

        autoWatch: false,

        //browsers: ['Chrome'],
        //browsers: ['IE', 'PhantomJS'],
        //browsers: ['IE'],
        //browsers: ['Firefox', 'PhantomJS'],
        //browsers: ['Firefox'],
        browsers: ['PhantomJS'],

        singleRun: true,

        client: {
            mocha: {
                reporter: 'html'
            }
        }

    });
};
