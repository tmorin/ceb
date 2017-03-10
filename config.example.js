const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: {
        'index': './example/index.js'
    },
    module: {
        loaders: [
            {test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.less/, loader: 'style-loader!css-loader!less-loader'},
            {test: /\.html/, loader: 'raw-loader'},
            {test: /\.md$/, loader: 'raw-loader!markdown-loader'}
        ]
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '_book/live')
    },
    resolve: {
        alias: {
            'ceb': path.join(__dirname, 'src/ceb.js')
        }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name: 'commons'}),
    ],
    devServer: {
        contentBase: '_book',
        noInfo: false,
        hot: true,
        inline: true,
        host: '0.0.0.0',
        port: 3000,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    }
};

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

module.exports = config;
