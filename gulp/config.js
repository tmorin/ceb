var fs = require('fs');

var paths = {
    es6: 'es6/**/*.js',
    lib: 'es6/lib/**/*.js',
    test: 'es6/test/**/*.js',
    example: 'es6/example/**/*.js',
    gulp: 'gulp/**/*.js',
    clean: ['./api', './dist', './lib']
};

module.exports = {
    pkg: JSON.parse(fs.readFileSync('package.json')),
    browserify: [{
        entry: 'es6/lib/ceb.js',
        standalone: 'ceb',
        modules: 'umd',
        distName: 'ceb.js',
        distPath: 'dist/standalone',
        min: true,
        watch: true
    }, {
        entry: 'es6/lib/idomizer/idomizer.js',
        standalone: 'idomizer',
        modules: 'umd',
        distName: 'idomizer.js',
        distPath: 'dist/standalone',
        min: true,
        watch: true
    }, {
        entry: 'node_modules/htmlparser2/lib/index.js',
        standalone: 'htmlparser2',
        modules: 'umd',
        distName: 'htmlparser2.js',
        distPath: 'dist/vendors',
        min: true
    }],
    babelify: [{
        src: paths.lib,
        modules: 'common',
        dest: 'lib'
    }, {
        src: paths.lib,
        modules: 'umd',
        dest: 'dist/umd'
    }, {
        src: paths.lib,
        modules: 'amd',
        dest: 'dist/amd'
    }, {
        src: paths.lib,
        modules: 'system',
        dest: 'dist/system'
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
