var fs = require('fs');
module.exports = {
    pkg: JSON.parse(fs.readFileSync('package.json')),
    isProduction: process.env.NODE_ENV === 'production',
    browserify: [{
        entry: 'lib/ceb.property.spec.js',
        distName: 'ceb',
        distPath: 'public'
    }/*, {
        entry: [
            'lib/ceb.property.spec.js',
            'lib/ceb-feature-cqrs.js',
            'lib/ceb-feature-frp.js',
            'lib/ceb-feature-template.js',
            'lib/ceb-feature-cqrs-rx.js',
            'lib/ceb-feature-frp-rx.js'
        ],
        exclude: ['rx'],
        distName: 'ceb-full',
        distPath: 'public'
    }*/],
    paths: {
        lib: 'src/lib/**/*.js',
        test: 'src/test/**/*.js',
        example: 'src/example/**/*.js',
        gulp: 'gulp/**/*.js',
        clean: ['./lib', './test', './example', './public', './.tmp']
    },
    sauceTasks: {
        ie: ['slIe11', 'slIe10', 'slIe9'],
        evergreen: ['slChrome', 'slFirefox'],
        safari: ['slSafari7', 'slSafari8'],
        android: ['slAndroid4', 'slAndroid5'],
        //iphone: ['slIPhone7', 'slIPhone8'],
        //ipad: ['slIPad7', 'slIPad8']
    },
    customLaunchers: {
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
    }
};
