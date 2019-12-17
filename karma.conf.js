const webpackDev = require('./webpack.dev');

module.exports = (config) => {
    config.set({
        frameworks: ['mocha'],

        reporters: ['progress', 'junit'],

        files: [
            {pattern: 'test/*.spec.ts', watched: false},
            {pattern: 'examples/*.spec.ts', watched: false}
        ],

        preprocessors: {
            'test/*.spec.ts': ['webpack'],
            'examples/*.spec.ts': ['webpack']
        },

        webpack: {
            module: webpackDev.module,
            resolve: webpackDev.resolve,
            mode: webpackDev.mode,
            devtool: webpackDev.devtool
        },

        webpackMiddleware: {
            stats: 'errors-only'
        },

        client: {
            mocha: {
                reporter: 'html'
            }
        },

        junitReporter: {
            outputDir: '.tmp/junit'
        },

        customLaunchers: {
            sl_firefox: {
                base: 'SauceLabs',
                browserName: 'firefox'
            },
            sl_chrome: {
                base: 'SauceLabs',
                browserName: 'chrome'
            },
            sl_edge: {
                base: 'SauceLabs',
                browserName: 'MicrosoftEdge'
            },
            sl_android: {
                base: 'SauceLabs',
                deviceName: 'Android GoogleAPI Emulator',
                platformName: 'Android',
                platformVersion: '9.0',
                browserName: 'Chrome'
            }
        },

        sauceLabs: {
            testName: 'ceb - unit testing',
            build: process.env.BUILD_NUMBER,
            tags: ['ceb'],
            recordVideo: true,
            recordScreenshots: true,
            connectOptions: {
                verbose: true,
                verboseDebugging: true,
                connectRetries: 3,
                connectRetryTimeout: 5000
            }
        }
    });
};
