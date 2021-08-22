const path = require('path');

module.exports = {
    entry: path.join(process.cwd(), "src/index.ts"),
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        allowJs: true
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        fallback: {
            util: false,
            process: require.resolve('process'),
        }
    },
    output: {
        path: path.join(process.cwd(), "umd"),
        library: path.basename(process.cwd()),
        libraryTarget: 'umd2',
    }
};

