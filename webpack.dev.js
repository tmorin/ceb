const process = require("process")
const webpack = require("webpack")
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
const path = require("path")

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  output: {
    filename: `${path.basename(process.cwd())}.js`,
  },
  resolve: {
    fallback: {
      util: require.resolve("util"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
})
