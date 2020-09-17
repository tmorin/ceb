const webpackDev = require('./webpack.dev');

if (!process.env.CHROME_BIN) {
    process.env.CHROME_BIN = require('puppeteer').executablePath();
}

module.exports = (config) => {
    config.set({
        frameworks: ['mocha'],

        reporters: ['progress', 'junit'],

        files: [
            {pattern: '{examples,src,test}/**/*.spec.ts', watched: false},
            {pattern: '{examples,src,test}/**/*', watched: true, included: false, served: false}
        ],

        preprocessors: {
            '{examples,src,test}/**/*.spec.ts': ['webpack']
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
        }
    });
};
