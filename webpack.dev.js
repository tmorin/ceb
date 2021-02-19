const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: 'dist/ceb.js'
    },
    resolve: {
        fallback: {
            util: require.resolve('util'),
            assert: require.resolve('assert'),
            process: require.resolve('process'),
        }
    }
});
