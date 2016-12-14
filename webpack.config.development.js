var webpack = require('webpack');
var baseConfig = require('./webpack.config.base.js');
var config = Object.assign({}, baseConfig);

config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
    })
];

module.exports = config;
