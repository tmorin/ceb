'use strict';

module.exports = function (config) {

    config.set({

        basePath: '',

        frameworks: ['mocha', 'sinon-chai', 'browserify'],

        files: [
            'node_modules/babel/node_modules/babel-core/browser-polyfill.js',
            'node_modules/document-register-element/build/document-register-element.js',
            //'node_modules/webcomponents.js/webcomponents-lite.min.js',
            'src/lib/**/*.js',
            'src/test/**/*.spec.js'
        ],

        exclude: [],

        preprocessors: {
            'src/lib/**/*.js': ['browserify'/*, 'coverage'*/],
            'src/test/**/*.spec.js': ['browserify'/*, 'coverage'*/],
        },

        browserify: {
            transform: ['babelify']
        },

        reporters: ['progress'/*, 'coverage'*/],

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

        // browsers: ['IE', 'PhantomJS'],
        // browsers: ['Chrome', 'PhantomJS'],
        browsers: ['Firefox', 'PhantomJS'],
        //browsers: ['PhantomJS'],

        singleRun: true,

        client: {
            mocha: {
                reporter: 'html'
            }
        }

    });
};
