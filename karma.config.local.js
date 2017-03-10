const base = require('./karma.config.base.js');
const override = {};
for (let k in base) {
    if (base.hasOwnProperty(k)) {
        override[k] = base[k];
    }
}

if (process.env.COVERAGE) {
    console.log('---- CAPTURE COVERAGE ----');
    override.webpack.module.rules[0] = {
        test: /\.js?$/,
        exclude: /node_modules|\/example\/|\.spec.js$/,
        loader: 'isparta-loader'
    };
    override.webpack.module.rules.push({test: /\/example\/|\.spec.js?$/, exclude: /node_modules/, loader: 'babel-loader'});
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
    // override.browsers = ['Firefox'];
    // config.browsers = ['Chrome'];
    // config.browsers = ['IE'];

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO ||
    override.logLevel = config.LOG_INFO;

    config.set(override);
};

