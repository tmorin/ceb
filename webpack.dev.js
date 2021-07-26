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
            util: false,
            process: require.resolve('process'),
        }
    }
});
