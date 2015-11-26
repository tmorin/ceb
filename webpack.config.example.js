'use strict';

var path = require('path');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var baseConfig = require('./webpack.config.base');
var config = Object.create(baseConfig);

var HTTP_PORT = 3000;

config.entry = {
    'ceb-address-selector': './example/ceb-address-selector.js',
    'ceb-form': './example/ceb-form.js',
    'ceb-grid': './example/ceb-grid.js',
    'ceb-list': './example/ceb-list.js',
    'ceb-list-plusplus': './example/ceb-list-plusplus.js',
    'ceb-templator': './example/ceb-templator.js',
    'index': './example/index.js',
    'loader-amd': './example/loader-amd.js',
    'loader-standalone': './example/loader-standalone.js',
    'loader-systemjs': './example/loader-systemjs.js',
    'loader-umd': './example/loader-umd.js',
    'todo-app': './example/todo-app.js'
};

config.output = {
    path: path.join(__dirname, 'site/example'),
    filename: '[name].js'
};

config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('commons', 'commons.js'),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
    })
];

['index', 'ceb-address-selector', 'ceb-list-plusplus', 'ceb-list', 'ceb-grid', 'ceb-templator', 'ceb-form', 'loader-amd', 'loader-standalone', 'loader-systemjs', 'loader-umd', 'todo-app'].forEach(function (chunk) {
    config.plugins.push(new HtmlWebpackPlugin({
        title: chunk === 'index' ? '' : chunk + ' - ceb\'s examples',
        template: './example/template.html',
        inject: 'head',
        chunks: ['commons', chunk],
        filename: chunk + '.html'
    }));
});

config.devServer = {
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
