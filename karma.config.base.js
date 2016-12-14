'use strict';

var webpackDevConfig = require('./webpack.config.development.js');

module.exports = {

    basePath: '',

    frameworks: ['mocha', 'sinon-chai'],

    files: [
        'node_modules/document-register-element/build/document-register-element.js',
        //'node_modules/webcomponents.js/webcomponents-lite.min.js',
        'test/**/*.spec.js',
        'example/**/*.spec.js'
    ],

    exclude: [],

    preprocessors: {
        'test/**/*.spec.js': ['webpack', 'sourcemap'],
        'example/**/*.spec.js': ['webpack', 'sourcemap']
    },

    webpack: Object.assign({}, webpackDevConfig, {
        devtool: 'inline-source-map'
    }),

    webpackMiddleware: {
        noInfo: true
    },

    reporters: ['progress'],

    port: 9877,

    colors: true,

    autoWatch: false,

    browsers: ['PhantomJS'],

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

};
