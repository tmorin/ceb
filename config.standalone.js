const path = require('path');

module.exports = {
    module: {
        rules: [
            {test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },
    output: {
        library: 'ceb',
        libraryTarget: 'umd'
    }
};