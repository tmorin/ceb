# Tutorial

## Create and configure the npm project

Create the project directory

```shell
node -e "require('fs').mkdirSync('ceb-tutorial')"
```

Jump into the project directory

```shell
cd ceb-tutorial
```

Initialize the npm project

```shell
npm init --yes
```

Add the dependencies

```shell
npm add -D typescript webpack ts-loader ceb karma karma-webpack karma-cli karma-chrome-launcher 
```

Create the source directory

```shell
node -e "require('fs').mkdirSync('src')"
```

Initialize the main module

```shell
node -e "require('fs').writeFileSync('src/ceb-tutorial.ts', ´´)"
```

Initialize the webpack config, webpack.js

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
