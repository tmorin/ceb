const process = require("process")
const path = require("path")
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: `${path.basename(process.cwd())}.min.js`,
  },
})
