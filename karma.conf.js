'use strict';

module.exports = function (config) {

    config.set({

        basePath: '',

        frameworks: ['mocha', 'chai', 'sinon'],

        files: [
            'node_modules/document-register-element/build/document-register-element.js',
            'src/**/*.js',
            'specs/**/*.spec.js'
        ],

        exclude: [],

        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            dir: 'build/cov',
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
