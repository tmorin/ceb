'use strict';

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var baseConfig = require('./webpack.config.base.js');
var config = Object.assign({}, baseConfig);

var HTTP_PORT = 3000;

config.entry = {
    'index': './example/index.js',
    'loader-amd': './example/loader/loader-amd.js',
    'loader-standalone': './example/loader/loader-standalone.js',
    'loader-systemjs': './example/loader/loader-systemjs.js',
    'address-selector': './example/address-selector/index.js',
    'list': './example/list/index.js',
    'list-plusplus': './example/list-plusplus/index.js',
    'grid': './example/grid/index.js',
    'templator': './example/templator/index.js',
    'form': './example/form/index.js',
    'todo-app': './example/todo-app/index.js'/*,
    'weather-app': './example/weather-app/index.js'*/
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
