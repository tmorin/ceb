'use strict';

var base = require('./karma.config.base');
var override = {};
for (var k in base) {
    if (base.hasOwnProperty(k)) {
        override[k] = base[k];
    }
}

module.exports = function (config) {

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO ||
    override.logLevel = config.LOG_INFO;

    override.customLaunchers = {
        slChrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            version: ''
        },
        slFirefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            version: ''
        },
        slIe11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11'
        },
        slIe10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '10'
        },
        slIe9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '9'
        },
        slAndroid4: {
            base: 'SauceLabs',
            browserName: 'android',
            version: '4.4'
        },
        slAndroid5: {
            base: 'SauceLabs',
            browserName: 'android',
            version: '5.0'
        },
        slSafari7: {
            base: 'SauceLabs',
            browserName: 'safari',
            version: '7'
        },
        slSafari8: {
            base: 'SauceLabs',
            browserName: 'safari',
            version: '8'
        },
        slIPhone7: {
            base: 'SauceLabs',
            browserName: 'iphone',
            deviceName: 'iPhone Simulator',
            version: '7.1',
            platform: 'OS X 10.10',
            'device-orientation': 'portrait'
        },
        slIPhone8: {
            base: 'SauceLabs',
            browserName: 'iphone',
            deviceName: 'iPhone Simulator',
            version: '8.4',
            platform: 'OS X 10.10',
            'device-orientation': 'portrait'
        },
        slIPad7: {
            base: 'SauceLabs',
            browserName: 'iphone',
            deviceName: 'iPad Simulator',
            version: '7.1',
            platform: 'OS X 10.10',
            'device-orientation': 'portrait'
        },
        slIPad8: {
            base: 'SauceLabs',
            browserName: 'iphone',
            deviceName: 'iPad Simulator',
            version: '8.4',
            platform: 'OS X 10.10',
            'device-orientation': 'portrait'
        }
    };

    override.sauceLabs = {
        testName: 'ceb - ' + name,
        recordVideo: false,
        recordScreenshots: false
    };

    override.captureTimeout = 3 * 60 * 1000;

    override.reporters = ['dots', 'saucelabs', 'junit'];

    override.junitReporter = {
        outputDir: process.env.CIRCLE_TEST_REPORTS || 'junit',
        useBrowserName: true
    };

    override.singleRun = true;

    override.autoWatch = false;

    config.set(override);
};

