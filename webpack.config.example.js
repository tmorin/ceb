var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var baseConfig = require('./webpack.config.base.js');
var config = Object.assign({}, baseConfig);

var HTTP_PORT = 3000;

config.entry = {
    'index': './example/index.js'
};

config.output = {
    path: path.join(__dirname, '_book/live'),
    filename: '[name].js'
};

config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('commons', 'commons.js'),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
    })
];

Object.keys(config.entry).forEach(function (chunk, i, all) {
    config.plugins.push(new HtmlWebpackPlugin({
        all: all,
        title: chunk,
        template: './example/template.ejs',
        inject: 'head',
        chunks: ['commons', chunk],
        filename: chunk + '.html',
        htmlContent: fs.readFileSync(config.entry[chunk].replace('.js', '.html'))
    }));
});

config.devServer = {
    contentBase: '_book',
    noInfo: false,
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: HTTP_PORT,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
};

module.exports = config;
