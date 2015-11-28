'use strict';

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var baseConfig = require('./webpack.config.base');
var config = Object.create(baseConfig);

var HTTP_PORT = 3000;

config.entry = {
    'index': './example/index.js',
    'loader-amd': './example/loader-amd.js',
    'loader-standalone': './example/loader-standalone.js',
    'loader-systemjs': './example/loader-systemjs.js',
    'loader-umd': './example/loader-umd.js',
    'ceb-address-selector': './example/ceb-address-selector.js',
    'ceb-list': './example/ceb-list.js',
    'ceb-list-plusplus': './example/ceb-list-plusplus.js',
    'ceb-grid': './example/ceb-grid.js',
    'ceb-templator': './example/ceb-templator.js',
    'ceb-form': './example/ceb-form.js',
    'todo-app': './example/todo-app.js'
};

config.output = {
    path: path.join(__dirname, '.site/example'),
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
