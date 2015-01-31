'use strict';

module.exports = function (config) {

    config.set({

        basePath: '',

        frameworks: ['mocha', 'chai', 'sinon'],

        files: [
            'node_modules/document-register-element/build/document-register-element.js',
            'node_modules/es6-shim/es6-shim.js',
            'node_modules/es6-shim/es6-sham.js',
            'src/**/*.js',
            'specs/**/*.spec.js'
        ],

        exclude: [],

        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            dir: 'build',
            reporters: [{
                type: 'lcov',
                subdir: 'coverage'
            }, {
                type: 'html',
                subdir: 'site/coverage'
            }]
        },

        port: 9877,

        colors: true,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO ||
        logLevel: config.LOG_INFO,

        autoWatch: false,

        //  browsers: ['IE'],
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
