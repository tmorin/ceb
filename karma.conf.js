'use strict';

module.exports = function (config) {

    config.set({

        basePath: '',

        frameworks: ['mocha', 'chai', 'sinon'],

        files: [
            // 'node_modules/document-register-element/build/document-register-element.js',
            'node_modules/webcomponents.js/webcomponents-lite.min.js',
            'node_modules/rx/dist/rx.lite.min.js',
            'src/ceb.js',
            'src/ceb-feature-template.js',
            'src/ceb-feature-frp.js',
            'src/ceb-feature-frp-rx.js',
            'src/ceb-feature-cqrs.js',
            'src/ceb-feature-cqrs-rx.js',
            'specs/**/*.spec.js'
        ],

        exclude: [],

        preprocessors: {
            'src/**/*.js': ['coverage']
        },

        reporters: ['progress', 'coverage'],

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

        // browsers: ['IE'],
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
