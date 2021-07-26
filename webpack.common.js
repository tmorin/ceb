const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/ceb.ts'),
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    output: {
        library: 'ceb',
        libraryTarget: 'umd2',
        path: path.resolve(__dirname)
    }
};

