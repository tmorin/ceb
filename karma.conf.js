'use strict';

module.exports = function (config) {

    config.set({

        basePath: '',

        frameworks: ['mocha', 'sinon-chai'],

        files: [
            'node_modules/document-register-element/build/document-register-element.js',
            //'node_modules/webcomponents.js/webcomponents-lite.min.js',
            'test/**/*.spec.js'
        ],

        exclude: [],

        preprocessors: {
            'test/**/*.spec.js': ['webpack', 'sourcemap']
        },

        webpack: {
            module: {
                loaders: [
                    {test: /\.js?$/, exclude: /node_modules/, loader: 'babel'}
                ]
            },
            devtool: 'inline-source-map'
        },

        webpackMiddleware: {
            noInfo: true
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
        //browsers: ['Chrome'],
        //browsers: ['IE'],

        customLaunchers: {
            IE9_EMULATE: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE9'
            },
            IE10_EMULATE: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE10'
            }
        },

        singleRun: true,

        client: {
            mocha: {
                reporter: 'html'
            }
        }

    });
};
