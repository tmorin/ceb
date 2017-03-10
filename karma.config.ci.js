const base = require('./karma.config.base.js');
const override = {};
for (let k in base) {
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
        slAndroid6: {
            base: 'SauceLabs',
            browserName: 'chrome',
            deviceName: 'Samsung Galaxy S6 Device',
            deviceOrientation: 'portrait',
            platformVersion: '6.0',
            platformName: 'Android'
        },
        slAndroid5: {
            base: 'SauceLabs',
            browserName: 'Browser',
            deviceName: 'Android Emulator',
            deviceOrientation: 'portrait',
            platformVersion: '5.1',
            platformName: 'Android'
        },
        slSafari8: {
            base: 'SauceLabs',
            browserName: 'safari',
            version: '8'
        },
        slSafari9: {
            base: 'SauceLabs',
            browserName: 'safari',
            version: '9'
        },
        slSafari10: {
            base: 'SauceLabs',
            browserName: 'safari',
            version: '10'
        },
        slIPhone9: {
            base: 'SauceLabs',
            browserName: 'Safari',
            deviceName: 'iPhone Simulator',
            version: '9.2',
            platform: 'iOS',
            deviceOrientation: 'portrait'
        },
        slIPhone10: {
            base: 'SauceLabs',
            browserName: 'Safari',
            deviceName: 'iPhone Simulator',
            version: '10.0',
            platform: 'iOS',
            deviceOrientation: 'portrait'
        }
    };

    override.sauceLabs = {
        testName: 'ceb - test',
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

