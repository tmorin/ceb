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

        port: 9877,

        colors: true,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO ||
        logLevel: config.LOG_INFO,

        autoWatch: false,

        //browsers: ['PhantomJS', 'Chrome', 'IE'],
        //browsers: ['PhantomJS', 'Chrome', 'Firefox'],
        //browsers: ['PhantomJS', 'Chrome', 'Firefox', 'IE'],
        //browsers: ['IE', 'PhantomJS'],
        //browsers: ['Chrome', 'PhantomJS'],
        //browsers: ['Firefox', 'PhantomJS'],
        browsers: ['PhantomJS'],
        //browsers: ['IE'],

        singleRun: true,

        client: {
            mocha: {
                reporter: 'html'
            }
        }

    });
};
