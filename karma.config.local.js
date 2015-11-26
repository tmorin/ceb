'use strict';

var base = require('./karma.config.base');
var override = {};
for (var k in base) {
    if (base.hasOwnProperty(k)) {
        override[k] = base[k];
    }
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

