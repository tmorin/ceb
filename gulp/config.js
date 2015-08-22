var fs = require('fs');

var paths = {
    es6: 'es6/**/*.js',
    lib: 'es6/lib/**/*.js',
    test: 'es6/test/**/*.js',
    example: 'es6/example/**/*.js',
    gulp: 'gulp/**/*.js',
    clean: ['./api', './lib', './public', './test']
};

module.exports = {
    pkg: JSON.parse(fs.readFileSync('package.json')),
    browserify: [{
        entry: 'es6/lib/ceb.js',
        standalone: 'ceb',
        modules: 'umd',
        distName: 'ceb.js',
        distPath: 'public/umd/lib',
        min: true
    }],
    babelify: [{
        src: paths.lib,
        modules: 'common',
        dest: 'lib'
    }, {
        src: paths.example,
        modules: 'umd',
        dest: 'public/umd/example',
        min: true
    }, {
        src: [paths.es6, '!' + paths.test],
        modules: 'system',
        dest: 'public/system',
        min: true
    }],
    paths: paths,
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
