var path = require('path');

module.exports = {
    module: {
        loaders: [
            {test: /\.js?$/, exclude: /node_modules/, loader: 'babel'},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.less/, loader: 'style!css!less'},
            {test: /\.html/, loader: 'raw'}
        ]
    },
    output: {
        library: 'ceb',
        libraryTarget: 'umd'
    },
    resolve: {
        alias: {
            'ceb': path.join(__dirname, 'src/ceb.js')
        }
    }
};
