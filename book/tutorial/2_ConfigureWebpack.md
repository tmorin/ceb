# 2 - Configure Webpack

## Update .gitignore

```shell
node -e "require('fs').appendFileSync('.gitignore', 'node_modules')"
```

## Add the dependencies

```shell
npm add -D typescript webpack ts-loader ceb 
```

## Add the webpack config

Create the file `webpack.js` with the following content:

```javascript
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/ceb-tutorial.ts'),
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: 'dist/ceb-tutorial.js'
  },
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
    extensions: ['.ts']
  },
  output: {
    library: 'ceb-tutorial',
    libraryTarget: 'umd',
    path: path.resolve(__dirname)
  }
}
```
