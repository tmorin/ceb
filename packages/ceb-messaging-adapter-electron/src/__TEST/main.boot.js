const electron = require("electron")
const webpack = require("webpack")
const webpackConf = require("./webpack.tpl")

webpack(webpackConf, (err) => {
  if (err) {
    throw err
  }
  // eslint-disable-next-line node/no-missing-require
  require("./.generated/main")
  setTimeout(() => electron.webContents.getAllWebContents().forEach((webContent) => webContent.send("main-ready")), 0)
})
