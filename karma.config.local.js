'use strict';

var base = require('./karma.config.base.js');
var override = {};
for (var k in base) {
    if (base.hasOwnProperty(k)) {
        override[k] = base[k];
    }
}

if (process.env.COVERAGE) {
    console.log('---- CAPTURE COVERAGE ----');
    override.webpack.module.loaders[0] = {test: /\.js?$/, exclude: /node_modules|\/example\/|\.spec.js$/, loader: 'isparta'};
    override.webpack.module.loaders.push({test: /\/example\/|\.spec.js?$/, exclude: /node_modules/, loader: 'babel'});
    override.reporters.push('coverage');
    override.coverageReporter = {
        reporters: [
            {type: 'lcov', dir: 'coverage/', subdir: '.'}
        ]
    };
}

module.exports = function (config) {

    // config.browsers = ['PhantomJS', 'Chrome', 'IE'];
    // config.browsers = ['PhantomJS', 'Chrome', 'Firefox'];
    // config.browsers = ['PhantomJS', 'Chrome', 'Firefox', 'IE'];
    // config.browsers = ['IE', 'PhantomJS'];
    // config.browsers = ['Chrome', 'PhantomJS'];
    // config.browsers = ['Firefox', 'PhantomJS'];
    override.browsers = ['PhantomJS'];
    // config.browsers = ['Chrome'];
    // config.browsers = ['IE'];

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO ||
    override.logLevel = config.LOG_INFO;

    config.set(override);
};

