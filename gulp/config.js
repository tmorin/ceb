var fs = require('fs');
module.exports = {
    pkg: JSON.parse(fs.readFileSync('package.json')),
    isProduction: process.env.NODE_ENV === 'production',
    browserify: [{
        entry: 'lib/ceb.js',
        distName: 'ceb',
        distPath: 'public'
    }, {
        entry: [
            'lib/ceb.js',
            'lib/ceb-feature-cqrs.js',
            'lib/ceb-feature-frp.js',
            'lib/ceb-feature-template.js',
            'lib/ceb-feature-cqrs-rx.js',
            'lib/ceb-feature-frp-rx.js'
        ],
        exclude: ['rx'],
        distName: 'ceb-full',
        distPath: 'public'
    }],
    paths: {
        lib: 'src/lib/**/*.js',
        test: 'src/test/**/*.js',
        example: 'example/**/*.js',
        gulp: 'gulp/**/*.js',
        clean: ['./lib', './test', './public']
    }
};
