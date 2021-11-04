const path = require('path');

module.exports = {
    target: "electron-main",
    entry: path.join(process.cwd(), "src/__TEST/main.ts"),
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
        path: path.join(process.cwd(), "src/__TEST/.generated"),
        filename: "main.js",
        library: path.basename(process.cwd()),
        libraryTarget: 'commonjs',
    }
}
