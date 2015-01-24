'use strict';

module.exports = function (config) {

    config.set({

        basePath: '',

        frameworks: ['mocha', 'chai', 'sinon'],

        files: [
            'node_modules/document-register-element/build/document-register-element.js',
            'node_modules/es6-shim/es6-shim.js',
            'node_modules/es6-shim/es6-sham.js',
            'src/*.js',
            'specs/**/*.js'
        ],

        exclude: [],

        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            dir: 'build/jscoverage',
            reporters: [{
                type: 'html',
                subdir: 'report-html'
            }, {
                type: 'lcov',
                subdir: 'report-lcov'
            }]
        },

        port: 9876,

        colors: true,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO ||
        logLevel: config.LOG_INFO,

        autoWatch: false,

        browsers: ['Firefox'],

        singleRun: true,

        client: {
            mocha: {
                reporter: 'html',
                ui: 'tdd'
            }
        }

    });
};
